'use client';

import { useState } from 'react';
import { marked } from 'marked';

interface BlogPost {
  title: string;
  content: string;
  outline: string[];
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown' | 'seo'>('preview');

  const generateBlog = async () => {
    if (!topic.trim()) {
      setError('Please enter a blog topic');
      return;
    }

    setLoading(true);
    setError('');
    setBlogPost(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, tone, length }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate blog post');
      }

      const data = await response.json();
      setBlogPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadMarkdown = () => {
    if (!blogPost) return;
    const blob = new Blob([blogPost.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blogPost.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Writing Agent
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            AI-powered blog automation tool - Generate professional blog posts in seconds
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Topic *
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The Future of Artificial Intelligence in Healthcare"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="conversational">Conversational</option>
                  <option value="technical">Technical</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                </select>
              </div>

              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Length
                </label>
                <select
                  id="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="short">Short (~500 words)</option>
                  <option value="medium">Medium (~1000 words)</option>
                  <option value="long">Long (~1500+ words)</option>
                </select>
              </div>
            </div>

            <button
              onClick={generateBlog}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Blog Post...
                </span>
              ) : (
                'Generate Blog Post'
              )}
            </button>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {blogPost && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {blogPost.title}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(blogPost.content)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition"
                >
                  Copy
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`py-2 px-4 font-medium transition ${
                    activeTab === 'preview'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('markdown')}
                  className={`py-2 px-4 font-medium transition ${
                    activeTab === 'markdown'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Markdown
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`py-2 px-4 font-medium transition ${
                    activeTab === 'seo'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  SEO
                </button>
              </div>
            </div>

            {activeTab === 'preview' && (
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(blogPost.content) as string }}
              />
            )}

            {activeTab === 'markdown' && (
              <pre className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-200">{blogPost.content}</code>
              </pre>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Content Outline</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {blogPost.outline.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Meta Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                    {blogPost.seo.metaDescription}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {blogPost.seo.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

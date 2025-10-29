import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, tone, length } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const lengthMap: Record<string, string> = {
      short: '500-700 words',
      medium: '1000-1200 words',
      long: '1500-2000 words',
    };

    const targetLength = lengthMap[length] || lengthMap.medium;

    // Generate blog post using Claude-like structured approach
    const blogPost = await generateBlogContent(topic, tone, targetLength);

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}

async function generateBlogContent(
  topic: string,
  tone: string,
  targetLength: string
): Promise<{
  title: string;
  content: string;
  outline: string[];
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}> {
  // Create outline
  const outline = generateOutline(topic);

  // Generate title
  const title = generateTitle(topic, tone);

  // Generate content sections
  const sections = generateSections(topic, tone, outline, targetLength);

  // Combine into markdown
  const content = `# ${title}\n\n${sections.join('\n\n')}`;

  // Generate SEO metadata
  const seo = generateSEO(topic, content);

  return {
    title,
    content,
    outline,
    seo,
  };
}

function generateTitle(topic: string, tone: string): string {
  const templates: Record<string, string[]> = {
    professional: [
      `${topic}: A Comprehensive Guide`,
      `Understanding ${topic}: Key Insights and Best Practices`,
      `${topic}: What You Need to Know`,
    ],
    casual: [
      `Everything You Need to Know About ${topic}`,
      `${topic}: The Complete Breakdown`,
      `Let's Talk About ${topic}`,
    ],
    conversational: [
      `${topic}: Here's What I Learned`,
      `My Take on ${topic}`,
      `${topic} Explained Simply`,
    ],
    technical: [
      `${topic}: Technical Overview and Implementation`,
      `Deep Dive: ${topic}`,
      `${topic}: Architecture and Best Practices`,
    ],
    friendly: [
      `Your Guide to ${topic}`,
      `${topic} Made Easy`,
      `Getting Started with ${topic}`,
    ],
    authoritative: [
      `The Definitive Guide to ${topic}`,
      `${topic}: Expert Analysis and Insights`,
      `Mastering ${topic}: A Complete Resource`,
    ],
  };

  const titleOptions = templates[tone] || templates.professional;
  return titleOptions[Math.floor(Math.random() * titleOptions.length)];
}

function generateOutline(topic: string): string[] {
  return [
    'Introduction and context',
    'Background and current state',
    'Key concepts and principles',
    'Practical applications',
    'Benefits and advantages',
    'Challenges and considerations',
    'Future outlook and trends',
    'Conclusion and key takeaways',
  ];
}

function generateSections(
  topic: string,
  tone: string,
  outline: string[],
  targetLength: string
): string[] {
  const sections: string[] = [];

  // Introduction
  sections.push(generateIntroduction(topic, tone));

  // Background
  sections.push(`## Background and Current State\n\n${generateBackgroundContent(topic, tone)}`);

  // Key Concepts
  sections.push(`## Key Concepts and Principles\n\n${generateKeyConceptsContent(topic, tone)}`);

  // Practical Applications
  sections.push(`## Practical Applications\n\n${generateApplicationsContent(topic, tone)}`);

  // Benefits
  sections.push(`## Benefits and Advantages\n\n${generateBenefitsContent(topic, tone)}`);

  // Challenges
  sections.push(`## Challenges and Considerations\n\n${generateChallengesContent(topic, tone)}`);

  // Future Outlook
  sections.push(`## Future Outlook and Trends\n\n${generateFutureContent(topic, tone)}`);

  // Conclusion
  sections.push(generateConclusion(topic, tone));

  return sections;
}

function generateIntroduction(topic: string, tone: string): string {
  const intros: Record<string, string> = {
    professional: `In today's rapidly evolving landscape, ${topic} has emerged as a critical area of focus for organizations and individuals alike. This comprehensive guide explores the multifaceted aspects of ${topic}, providing valuable insights and practical perspectives.`,
    casual: `${topic} is everywhere these days, and for good reason. Whether you're just getting started or looking to deepen your understanding, this guide has you covered. Let's dive in and explore what makes ${topic} so important.`,
    conversational: `You've probably heard a lot about ${topic} lately. It's one of those things that seems to come up in every conversation about innovation and progress. So, what's the deal with ${topic}? Let me break it down for you.`,
    technical: `${topic} represents a significant advancement in modern technology and methodology. This technical overview examines the architecture, implementation details, and best practices associated with ${topic}, providing a foundation for understanding its capabilities and limitations.`,
    friendly: `Hey there! Ready to learn about ${topic}? Don't worry if it seems complicated at first – I'll walk you through everything you need to know in a way that's easy to understand. By the end of this guide, you'll have a solid grasp of ${topic} and how it can benefit you.`,
    authoritative: `${topic} stands as one of the most significant developments in recent years. Drawing from extensive research and industry experience, this definitive guide provides authoritative insights into ${topic}, examining its theoretical foundations, practical implementations, and strategic implications.`,
  };

  return intros[tone] || intros.professional;
}

function generateBackgroundContent(topic: string, tone: string): string {
  return `The evolution of ${topic} has been marked by significant milestones and transformative developments. Understanding the current state requires examining both historical context and contemporary trends.

Over the past several years, ${topic} has undergone substantial transformation, driven by technological advancement, changing market demands, and evolving best practices. What began as a niche concept has expanded into a mainstream consideration for organizations across industries.

Today's landscape is characterized by increased adoption, refined methodologies, and a growing body of evidence supporting the value of ${topic}. Industry leaders and early adopters have demonstrated tangible results, paving the way for broader implementation.`;
}

function generateKeyConceptsContent(topic: string, tone: string): string {
  return `Understanding ${topic} requires familiarity with several fundamental concepts:

**Core Principles**: At its foundation, ${topic} is built on principles of efficiency, effectiveness, and continuous improvement. These principles guide implementation and inform decision-making at every level.

**Essential Components**: The key components of ${topic} work together synergistically. Each element plays a crucial role in the overall system, contributing to outcomes and value creation.

**Methodological Approach**: Successful implementation of ${topic} follows a structured methodology that emphasizes planning, execution, measurement, and iteration. This systematic approach ensures consistency and enables optimization over time.

**Integration Considerations**: ${topic} doesn't exist in isolation. It must be integrated with existing systems, processes, and organizational culture to achieve maximum impact.`;
}

function generateApplicationsContent(topic: string, tone: string): string {
  return `${topic} finds application across a diverse range of scenarios and use cases:

**Industry Applications**: Organizations across sectors leverage ${topic} to drive innovation, improve efficiency, and create competitive advantage. From startups to enterprises, implementation scales to meet varying needs and constraints.

**Specific Use Cases**: Common applications include process optimization, decision support, resource allocation, and strategic planning. Each use case demonstrates the versatility and adaptability of ${topic}.

**Real-World Examples**: Practical implementations showcase the tangible benefits of ${topic}. Organizations report improvements in key metrics including productivity, quality, cost efficiency, and customer satisfaction.

**Scalability**: Solutions built on ${topic} can scale from small pilot projects to enterprise-wide deployments, accommodating growth and evolving requirements.`;
}

function generateBenefitsContent(topic: string, tone: string): string {
  return `Organizations and individuals implementing ${topic} experience numerous advantages:

**Operational Efficiency**: ${topic} streamlines processes, reduces redundancy, and optimizes resource utilization. This translates directly into cost savings and improved productivity.

**Enhanced Decision-Making**: By providing better data, insights, and analytical capabilities, ${topic} enables more informed decision-making at all organizational levels.

**Competitive Advantage**: Early adopters of ${topic} gain significant competitive advantages through innovation, faster time-to-market, and superior customer experiences.

**Measurable ROI**: Implementations typically demonstrate clear return on investment through quantifiable improvements in key performance indicators.

**Future-Proofing**: Investing in ${topic} positions organizations to adapt more effectively to future challenges and opportunities.`;
}

function generateChallengesContent(topic: string, tone: string): string {
  return `While the benefits are substantial, implementing ${topic} presents certain challenges:

**Implementation Complexity**: Getting started with ${topic} requires careful planning, adequate resources, and technical expertise. Organizations must navigate complexity while maintaining focus on objectives.

**Change Management**: Successful adoption requires organizational change management. Teams need training, support, and time to adapt to new ways of working.

**Resource Requirements**: Initial investment in ${topic} may be significant, encompassing technology, personnel, and operational costs. Organizations must evaluate ROI against available resources.

**Integration Challenges**: Connecting ${topic} with legacy systems and existing processes can present technical and organizational obstacles that require careful attention.

**Best Practice Evolution**: As ${topic} continues to evolve, staying current with best practices and emerging trends requires ongoing commitment and learning.`;
}

function generateFutureContent(topic: string, tone: string): string {
  return `The future of ${topic} promises continued evolution and expansion:

**Emerging Trends**: Several trends are shaping the next generation of ${topic}, including increased automation, enhanced integration capabilities, and more sophisticated analytical tools.

**Technology Convergence**: ${topic} increasingly intersects with other technological domains, creating new possibilities and applications.

**Market Growth**: Industry analysts project significant growth in ${topic} adoption across sectors and geographies. This expansion will drive innovation and refinement of approaches.

**Innovation Opportunities**: The evolving landscape presents numerous opportunities for innovation, from new methodologies to novel applications and use cases.

**Long-Term Outlook**: Looking ahead, ${topic} is positioned to become increasingly central to organizational strategy and operations, with implications extending far beyond current applications.`;
}

function generateConclusion(topic: string, tone: string): string {
  const conclusions: Record<string, string> = {
    professional: `## Conclusion\n\n${topic} represents a significant opportunity for organizations and individuals seeking to improve outcomes, drive innovation, and remain competitive in an evolving landscape. While implementation presents challenges, the potential benefits make it a worthwhile investment.\n\nSuccess with ${topic} requires commitment, strategic planning, and ongoing optimization. Organizations that approach implementation thoughtfully, learn from experience, and adapt to changing conditions position themselves for long-term success.\n\nAs the field continues to evolve, staying informed about developments, best practices, and emerging trends will be essential for maximizing value from ${topic}.`,
    casual: `## Wrapping Up\n\n${topic} is clearly here to stay, and for good reason. Sure, there are challenges to work through, but the potential payoff makes it worth the effort.\n\nIf you're considering getting started with ${topic}, take it one step at a time. Learn from others, stay flexible, and don't be afraid to experiment. The landscape is still evolving, which means there's plenty of room for innovation and new approaches.\n\nThanks for sticking with me through this guide. Here's to your success with ${topic}!`,
    conversational: `## Final Thoughts\n\nSo there you have it – everything you need to know about ${topic}. It's a big topic with lots of moving parts, but I hope this guide has made it more approachable.\n\nThe key takeaway? ${topic} offers real value, but success requires thoughtful implementation and ongoing commitment. Don't get overwhelmed by the complexity – start small, learn as you go, and build from there.\n\nWhat's your next step going to be?`,
    technical: `## Conclusion\n\nThis technical overview has examined ${topic} from multiple perspectives, covering architecture, implementation considerations, and best practices. The analysis demonstrates both the capabilities and constraints of current approaches.\n\nSuccessful implementation requires attention to technical details, architectural decisions, and operational considerations. Organizations must balance competing requirements while maintaining focus on core objectives.\n\nContinued research and development in ${topic} will address current limitations and expand capabilities. Staying current with technical developments remains essential for optimal implementation.`,
    friendly: `## Wrapping Things Up\n\nYou've made it to the end! By now, you should have a solid understanding of ${topic} and how it can make a difference.\n\nRemember, everyone starts somewhere. Don't feel pressured to implement everything at once. Take your time, start with what makes sense for your situation, and build from there.\n\nIf you have questions along the way, don't hesitate to reach out to the community. There are lots of people who've been where you are and are happy to help.\n\nGood luck with your ${topic} journey!`,
    authoritative: `## Conclusion\n\nThis comprehensive analysis has established ${topic} as a critical consideration for forward-thinking organizations. The evidence clearly demonstrates significant potential for value creation, operational improvement, and competitive advantage.\n\nSuccessful implementation demands strategic vision, operational excellence, and sustained commitment. Organizations must approach ${topic} not as a tactical initiative but as a strategic imperative requiring board-level attention and executive sponsorship.\n\nThe trajectory of ${topic} points unequivocally toward increased importance and broader application. Organizations that position themselves at the forefront of this evolution will reap substantial rewards.`,
  };

  return conclusions[tone] || conclusions.professional;
}

function generateSEO(topic: string, content: string): {
  metaDescription: string;
  keywords: string[];
} {
  const metaDescription = `Comprehensive guide to ${topic}. Learn about key concepts, practical applications, benefits, challenges, and future trends. Expert insights and actionable advice.`;

  const keywords = [
    topic,
    `${topic} guide`,
    `${topic} benefits`,
    `${topic} implementation`,
    `${topic} best practices`,
    `${topic} trends`,
    `${topic} challenges`,
    `what is ${topic}`,
  ];

  return {
    metaDescription: metaDescription.substring(0, 160),
    keywords,
  };
}

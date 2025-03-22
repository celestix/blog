export interface Metadata {
	title: string,
	pubDate: string,
	description: string,
	author: string,
	image: {
		url: string,
		alt: string
	}
	tags: string[],
	layout: string,
  draft: boolean
}

export function removeMarkdown(md: string) {
    // Remove headers
    md = md.replace(/^#* /gm, '');
    // Remove emphasis (bold, italic)
    md = md.replace(/(\*\*|__)(.*?)\1/g, '$2');
    md = md.replace(/(\*|_)(.*?)\1/g, '$2');
    // Remove links
    md = md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // Remove images
    md = md.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
    // Remove blockquotes
    md = md.replace(/^> /gm, '');
    // Remove inline code
    md = md.replace(/`([^`]+)`/g, '$1');
    // Remove code blocks
    md = md.replace(/```[\s\S]*?```/g, '');
    // Remove horizontal rules
    md = md.replace(/^---$/gm, '');
    // Remove lists
    md = md.replace(/^\s*[-+*] /gm, '');
    md = md.replace(/^\d+\. /gm, '');
    // Remove any remaining Markdown formatting
    md = md.replace(/([*_~`])/g, '');
    return md;
  }
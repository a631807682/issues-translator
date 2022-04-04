export function commentTemplate(note: string, comment: string): string {
  if (note === '') {
    return comment
  }

  return `
> ${note}

${comment}
    `
}

export function cleanAnnotation(s: string): string {
  // remove markdown comment
  return s.replace(/<!--[\s\S]*?-->/g, '')
}

export function cleanCode(s: string): string {
  return s.replace(/```(\s|[a-zA-Z]*)\n([\s\S]*?)```/g, '')
}

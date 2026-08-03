/** Google Drive 파일 ID를 <img>에 바로 쓸 수 있는 URL로 변환 */
export function driveImageUrl(fileId: string, width = 1000): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
}


export default interface D3Element {
  setParent(node: HTMLElement): void,
  resize(width: number, height: number): void,
  repaint(): void,
  setData(any: any): void
}
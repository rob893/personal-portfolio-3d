export class Time {
  private dTime: number = 0;
  private tTime: number = 0;
  private prevTime: number | null = null;

  public get deltaTime(): number {
    return this.dTime;
  }

  public get totalTime(): number {
    return this.tTime;
  }

  public updateTime(timeSincePageLoad: number): void {
    if (this.prevTime === null) {
      this.prevTime = timeSincePageLoad;
    }

    this.dTime = (timeSincePageLoad - this.prevTime) / 1000;
    this.prevTime = timeSincePageLoad;
    this.tTime += this.dTime;
  }
}

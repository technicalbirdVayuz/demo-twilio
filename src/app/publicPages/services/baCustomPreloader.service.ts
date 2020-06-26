import { Injectable } from '@angular/core';

@Injectable()
export class BaCustomPreLoader {

  private _selector: string = 'preLoader';
  private _element: HTMLElement;

  constructor() {}

  public show(): void {
    this._element = document.getElementById(this._selector);
     if(this._element)
    this._element.style['display'] = 'block';
  }

  public hide(delay: number = 0): void {
    this._element = document.getElementById(this._selector);
    setTimeout(() => {
      if(this._element)
      this._element.style['display'] = 'none';
    }, delay);
  }
}

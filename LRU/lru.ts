'use strict';

interface ILRU {
  maxAge:number
  size:number
}

class LRU {
  maxAge: number
  maxSize: number
  size: number
  map: Object
  linkList: DoubleLinkedList

  constructor(maxAge:number, size:number) {
    this.maxAge = maxAge;
    this.maxSize = size;
    this.map = {};
    this.linkList = new DoubleLinkedList();
  }

  getSize():number {
    let result = 0;
    for(let [key, value] of Object.entries(this.map)) {
      result += key.length;
      result += value.length;
    }
    return result;
  }

  get(key:any) {

  }

  set(key:any, value:any):void {
    const currentSize = key.length + value.length;
    if (currentSize > this.maxSize) {
      throw(new Error('key exceed max size!!!!'));
    }
    while (this.getSize() + currentSize > this.maxSize) {
      this.linkList.pop();
    }
    this[key] = value;
    this.linkList.unshift(new LinkNode(key));
  }

  has(key:any):boolean {
    return true;
  }
 }

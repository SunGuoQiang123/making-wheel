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
    const node = this.linkList.findNode(key);
    if (node) {
      // check masAge expires
      if (new Date().getTime()  - node.timestamp > this.maxAge) {
        this.linkList.drop(key);
        return false;
      } else {
        this.linkList.removeToTop(key);
        return this.map[key];
      }
    }
    return false;
  }

  add(key:any, value:any):void {
    const currentSize = key.length + value.length;
    if (currentSize > this.maxSize) {
      throw(new Error('key exceed max size!!!!'));
    }
    while (this.getSize() + currentSize > this.maxSize) {
      delete this[this.linkList.tail.value];
      this.linkList.pop();
    }
    this[key] = value;
    this.linkList.unshift(new LinkNode(key));
  }

  has(key:any):boolean {
    const node = this.linkList.findNode(key);
    if (node) {
      return true;
    } else {
      return false;
    }
  }

  set(key:string, value:string):void {
    const currentSize = key.length + value.length;
    if (currentSize > this.maxSize) {
      throw(new Error('key size exceeded!!!'));
    }

    if (this.linkList.findNode(key) ) {
      this.linkList.removeToTop(key);
      while (this.getSize() > this.maxSize) {
        delete this[this.linkList.tail.value];
        this.linkList.pop();
      }
      this[key] = value;
    } else {
      return;
    }
  }

  delete(key:string):void {
    delete this[key];
    this.linkList.drop(key);
  }
 }

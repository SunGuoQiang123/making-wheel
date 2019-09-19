interface ILinkNode {
  prev: ILinkNode | null
  next: ILinkNode | null
  value: any
  timestamp: number
}

interface IDoubleLinkedList {
  head: ILinkNode
  tail: ILinkNode
  unshift: Function
}

class LinkNode implements ILinkNode {
  prev = null;
  next = null;
  timestamp:number;
  value:any;
  constructor(value) {
    this.value = value;
    this.timestamp = new Date().getTime();
  }
}

class DoubleLinkedList {
  head: ILinkNode | null
  tail: ILinkNode | null

  constructor() {
    this.head = null;
    this.tail = null;
  }

  pop():LinkNode {
    const del = this.tail;
    if (this.tail.prev) {
      this.tail = this.tail.prev;
    }
    return del;
  }

  removeToTop(value:string):void {
    let node = this.head;
    let res = null;
    while(node && !res) {
      if (node.value === value) {
        res = node;
      } else {
        node = node.next;
      }
    }
    if (!res) return;
    if(res.prev) {
      res.prev.next = res.next;
      if (res === this.tail) {
        res.prev = this.tail;
      }
    }
    if(res.next) {
      res.next.prev = res.prev;
      if (res === this.head) {
        res.next = this.head;
      }
    }
    if (this.getSize() === 1) {
      this.updateNodeTime(res);
    } else {
      const newNode = new LinkNode(value);
      this.unshift(newNode);
    }
  }

  getSize():number {
    let count = 0;
    let node = this.head;
    while(node) {
      node = node.next;
      count++;
    }
    return count;
  }

  unshift(node:LinkNode):void {
    node.next = this.head;
    if(this.head) this.head.prev = node;
    this.head = node;
    if(!this.tail) this.tail = node;
  }

  updateNodeTime(node:LinkNode):void {
    node.timestamp = new Date().getTime();
  }

  findNode(key: string):LinkNode {
    let node = this.head;
    while (node && node.value !== key) {
      node = node.next;
    }
    return node;
  }

  drop(key:string) {
    if (this.getSize() === 1) {
      this.head = this.tail = null;
    } else {
      let node = this.head;
      while (node && node.value !== key) {
        node = node.next;
      }
      if(!node) return false;
      if(node.prev) {
        node.prev.next = node.next;
        if(node === this.tail) this.tail = node.prev;
      }
      if(node.next) {
        node.next.prev = node.prev;
        if(node === this.head) this.head = node.next;
      }
    }
  }
}

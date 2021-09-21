export interface StringTMap<T> {
  [key: string]: T;
}
export interface NumberTMap<T> {
  [key: number]: T;
}

export interface StringAnyMap extends StringTMap<any> {}

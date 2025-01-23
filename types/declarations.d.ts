declare module 'lodash.debounce' {
    import { DebounceSettings } from 'lodash';
  
    export default function debounce<T extends (...args: any) => any>(
      func: T,
      wait?: number,
      options?: DebounceSettings
    ): T & { cancel: () => void; flush: () => void };
  }
  
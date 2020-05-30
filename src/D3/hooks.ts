import { useLayoutEffect, useState, useEffect } from 'react';

export function useElementSize(ref: {current: any}) {
  const [size, setSize] = useState([0, 0]);

  function updateSize() {
    const element = ref.current
    if(element && (
      element.clientWidth != size[0] ||
      element.clientHeight != size[1]
    ) ) {
      setSize([element.clientWidth, element.clientHeight]);
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useLayoutEffect(updateSize)

  return size;
}

export function useLoading<T>(func: (...args) => Promise<T>, ...args) {
  const [data, setData] = useState<T>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(count => count + 1)
    func(...args).then(data => {
      setData(data)
      setCount(count => count - 1)
    })
  }, args)

  return [
    data,
    (data == null) || (count > 0)
  ]
}
import {
  useImperativeHandle,
  forwardRef,
  FC,
  useLayoutEffect,
  useRef,
  Ref,
  useEffect
} from 'react';
import { createPortal } from 'react-dom';
import { useUnmount } from '../utils/useUnmount';

export interface PortalProps {
  element?: string;
  className?: string;
  onMount?: () => void;
  onUnmount?: () => void;
}

export const Portal: FC<PortalProps & { ref?: Ref<HTMLElement> }> = forwardRef(
  (
    {
      children,
      className,
      element = 'div',
      onMount = () => undefined,
      onUnmount = () => undefined
    },
    ref
  ) => {
    const elementRef = useRef<HTMLElement>(document.createElement(element));
    const mounted = useRef<boolean>(false);

    useEffect(() => {
      if (className) {
        elementRef.current.setAttribute('class', `${className} rdk-portal`);
      }
    }, [className]);

    useLayoutEffect(() => {
      onMount?.();
    }, []);

    useUnmount(() => {
      onUnmount?.();

      // Reference: https://medium.com/trabe/reusable-react-portals-17dead20232b
      window.requestAnimationFrame(() => {
        document.body.removeChild(elementRef.current);
      });
    });

    if (!mounted.current) {
      mounted.current = true;
      elementRef.current.classList.add('rdk-portal');
      document.body.appendChild(elementRef.current);
    }

    const portal = createPortal(children, elementRef.current);

    useImperativeHandle(ref, () => elementRef.current);

    return portal;
  }
);

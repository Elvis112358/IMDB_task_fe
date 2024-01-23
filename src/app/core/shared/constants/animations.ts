import {
    animate,
    animation,
    group,
    query,
    stagger,
    style,
  } from '@angular/animations';
  
  export const enterAnimation = animation([
    style({ height: '0px', 'padding-bottom': '1px', overflow: 'hidden' }),
    group([
      animate('200ms ease-out', style({ height: '*' })),
      query(
        '.wrapper',
        [
          style({ opacity: 0, transform: 'translateY(-110px)' }),
          stagger(1000, [
            animate(
              '200ms cubic-bezier(0.7, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' })
            ),
          ]),
        ],
        { optional: true }
      ),
    ]),
  ]);
  
  export const leaveAnimation = animation([
    style({ height: '*', overflow: 'hidden' }),
    group([
      animate('200ms ease-out', style({ height: '0', 'padding-top': '1px' })),
      query(
        '.wrapper',
        [
          style({ opacity: 1, transform: 'translateY(0)' }),
          stagger(1000, [
            animate('200ms cubic-bezier(0.7, 0, 0.25, 1)', style({ opacity: 0 })),
          ]),
        ],
        { optional: true }
      ),
    ]),
  ]);
  
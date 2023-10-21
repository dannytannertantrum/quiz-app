/**
 *
 * @returns a giant question mark that animates a bg-color fill from bottom to top
 *
 * Styles can be found in global.css
 */
export const RequestLoader = ({ handleAnimationEnd }: { handleAnimationEnd?: () => void }) => {
  return (
    <h3 className='requestLoader' onAnimationEnd={handleAnimationEnd}>
      ?
    </h3>
  );
};

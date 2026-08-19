import styles from "./DisplayText.module.css";

type DisplayTextProps = {
  children: string;
  variant?: "mixed" | "brand" | "remainder";
};

const FIRST_LETTER_PATTERN = /\p{L}/u;

/**
 * Preserves the authored text in the DOM while limiting Renamor's script form
 * to the first letter. The casing classes only affect its visual rendering.
 */
export function DisplayText({ children, variant = "mixed" }: DisplayTextProps) {
  if (variant === "brand") {
    return (
      <span className={styles.brand} data-display-variant="brand">
        {children}
      </span>
    );
  }

  if (variant === "remainder") {
    return <span className={styles.remainder}>{children}</span>;
  }

  const firstLetterIndex = children.search(FIRST_LETTER_PATTERN);

  if (firstLetterIndex === -1) {
    return children;
  }

  const before = children.slice(0, firstLetterIndex);
  const firstLetter = children.slice(firstLetterIndex, firstLetterIndex + 1);
  const remainder = children.slice(firstLetterIndex + 1);

  return (
    <>
      {before}
      <span className={styles.initial}>{firstLetter}</span>
      <span className={styles.remainder}>{remainder}</span>
    </>
  );
}

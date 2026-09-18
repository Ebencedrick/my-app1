type TikTokIconProps = {
  className?: string;
};

export default function TikTokIcon({ className = "w-4 h-4" }: TikTokIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-label="TikTok"
      role="img"
    >
      <path d="M14.5 2.5c.7 1.9 2.3 3.2 4.2 3.5v2.9c-1.5-.1-2.8-.6-4.1-1.4v7.1c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .8 0 1.2.1v3.1c-.4-.1-.8-.1-1.2-.1-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9c1.6 0 2.9-1.3 2.9-2.9V2.5h4.1Z" />
    </svg>
  );
}

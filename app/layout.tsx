import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-be-vietnam',
});

export const metadata: Metadata = {
  title: 'Lịch của tôi – Lịch âm dương Việt Nam',
  description:
    'Xem lịch âm dương, Can Chi, Giờ Hoàng Đạo, Ngày tốt xấu, Tra cứu tuổi và chọn ngày tốt cho sự kiện.',
  keywords: 'lịch âm dương, lịch việt nam, hoàng đạo, can chi, ngày tốt, tra tuổi',
  openGraph: {
    title: 'Lịch của tôi',
    description: 'Lịch âm dương Việt Nam đầy đủ và tiện lợi',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body>{children}</body>
    </html>
  );
}

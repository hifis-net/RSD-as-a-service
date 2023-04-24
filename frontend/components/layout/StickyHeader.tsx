// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function StickyHeader({children, className}:
  { children: any, className?: string}) {
  return (
    <section
      className={`sticky top-0 z-[1] flex items-start xl:items-center gap-4 py-6 w-full ${className}`}
    >
      {children}
    </section>
  )
}

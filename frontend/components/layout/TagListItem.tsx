// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

export default function TagListItem({label, className, title}:
  {label: string, className?:string, title?:string}) {
  if (!label) return null
  return (
    <li
      title={title ? title : label}
      className={`m-[0.125rem] px-4 py-2 ${className ? className : 'bg-grey-200'}`}
    >
      {label}
    </li>
  )
}

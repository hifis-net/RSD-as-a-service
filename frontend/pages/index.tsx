// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import AOS from 'aos'
import AppFooter from '~/components/layout/AppFooter'
import ThemeSwitcher from '~/components/layout/ThemeSwitcher'
import SimpleCircle from '~/components/svg/SimpleCircle'
import Link from 'next/link'
import Image from 'next/image'

import LogoApp from '~/assets/LogoApp.svg'
import LogoAppSmall from '~/assets/LogoAppSmall.svg'

import LoginButton from '~/components/login/LoginButton'
import styles from '~/components/home/home.module.css'

import LogoHelmholtz from '~/assets/logos/LogoHelmholtz.svg'

/*! purgecss start ignore */
import 'aos/dist/aos.css'
/*! purgecss end ignore */

import PageContainer from '~/components/layout/PageContainer'


const whyrsd = [
  'Improves findability of software packages.',
  'Includes metadata to help search engines understand what a given software package is about.',
  'Harvests data from Zotero, Zenodo, GitHub, GitLab, and other sources.',
  'Presents software packages within their social and scientific context.',
  'Promotes dissemination of software.',
  // 'Modular system that is meant to be customizable, e.g. with respect to branding, database schemas, an so on..',
  'Makes scientific impact visible in a qualitative way.',
  'Helps decision-making based on metrics and graphs.',
  'Provides metadata via OAI-PMH, the standard protocol for metadata harvesting.',
  'The Research Software Directory is a content management system that is tailored to software.'
]


export default function Home() {
  const [isDark, setDark] = useState(true)

  // Initialize AOS library
  useEffect(() => { AOS.init() }, [])

  return (
      <div className="bg-white text-white bg-secondary">
        {/* Header  */}
        <header
          data-testid="Landing Page"
          className="sticky top-0 px-5 md:px-10 z-10 bg-secondary">

          <div className="w-full max-w-screen-xl mx-auto flex py-6 items-center">
            <Link href="/" passHref>
              <a className="hover:shadow-2xl">
                <LogoApp className="hidden xl:block"/>
                <LogoAppSmall className="block xl:hidden"/>
              </a>
            </Link>
            <div className="flex flex-1">
              <div className="hidden sm:flex w-full text-lg ml-28 gap-5 text-center opacity-80 ">
                <a href="#whyrsd">Why RSD</a>
                <Link href="/software">Software</Link>
                <Link href="/projects">Projects</Link>
                <Link href="/organisations">Organisations</Link>
                {/*<Link href="/about">About us</Link>*/}
              </div>
            </div>

            {/*Search*/}
            {/*<div className="border px-3 py-2 flex relative ml-auto rounded-sm">*/}
            {/*  <svg className="absolute right-[10px] top-[10px]" width="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*    <circle cx="8.98438" cy="9.10718" r="8.22705" stroke="currentColor"/>*/}
            {/*  </svg>*/}
            {/*  <input type="search" className="bg-transparent focus:outline-none"*/}
            {/*         placeholder="Search Software" autoComplete="off"/>*/}
            {/*</div>*/}

            {/*<ThemeSwitcher className="mr-3"/>*/}

            <LoginButton/>
          </div>
        </header>

        <div className="bg-secondary">
          <PageContainer className="flex flex-row flex-wrap text-white px-4 pt-16 pb-12">
            <div className="w-1/3 flex flex-col pr-10">
              <LogoHelmholtz width="220" />
              <div className="pt-2">Spitzenforschung für<br />große Herausforderungen.</div>
              <div className="w-[250px] bg-primary hover:bg-grey-500 text-white text-center font-medium text-2xl mt-12 py-4 px-6 rounded-sm">
                Add your software
              </div>
            </div>
            <div className="w-2/3 xs:pt-6 sm:pt-0 md:pt-0 lg:pt-0 xl:pt-0">
              <div className="text-3xl">Promote your own and discover existing Research Software</div>
              <div className="text-2xl">Because software matters</div>
            </div>
          </PageContainer>
        </div>

        <div className="bg-white">
          <PageContainer className="text-secondary px-4 pt-6 pb-12">
            <h1 className="pb-4">Software Spotlights</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Id volutpat lacus laoreet non curabitur gravida arcu. Amet mauris commodo quis imperdiet massa tincidunt nunc. Varius sit amet mattis vulputate. Suscipit adipiscing bibendum est ultricies integer. Hendrerit gravida rutrum quisque non tellus. Eget felis eget nunc lobortis mattis aliquam. Integer enim neque volutpat ac tincidunt vitae. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant.</p>
          </PageContainer>
        </div>

        <div className="bg-secondary">
          <PageContainer className="text-white px-4 pt-6 pb-12">
            <h1 className="pb-4">Software Meta Repository</h1>
            <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Id volutpat lacus laoreet non curabitur gravida arcu. Amet mauris commodo quis imperdiet massa tincidunt nunc. Varius sit amet mattis vulputate. Suscipit adipiscing bibendum est ultricies integer. Hendrerit gravida rutrum quisque non tellus. Eget felis eget nunc lobortis mattis aliquam. Integer enim neque volutpat ac tincidunt vitae. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant.</p>
          </PageContainer>
        </div>

        <div className="bg-white">
          <PageContainer className="text-secondary px-4 pt-6 pb-12">
            <h1 className="pb-4">Roadmap</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Proin libero nunc consequat interdum. Pretium vulputate sapien nec sagittis aliquam malesuada bibendum arcu. Id volutpat lacus laoreet non curabitur gravida arcu. Amet mauris commodo quis imperdiet massa tincidunt nunc. Varius sit amet mattis vulputate. Suscipit adipiscing bibendum est ultricies integer. Hendrerit gravida rutrum quisque non tellus. Eget felis eget nunc lobortis mattis aliquam. Integer enim neque volutpat ac tincidunt vitae. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant.</p>
          </PageContainer>
        </div>

        <AppFooter/>
      </div>
  )
}

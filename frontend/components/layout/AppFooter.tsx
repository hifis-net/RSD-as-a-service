import Link from 'next/link'
import LogoEscience from '~/components/svg/LogoEscience'
import Mail from '@mui/icons-material/Mail'
import LogoHifis from '~/assets/logos/LogoHIFISWhite.svg'

export default function AppFooter () {
  return (
    <footer className="flex flex-wrap text-white border-t bg-secondary border-grey-A400">
      <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-[_2fr,1fr] lg:container lg:mx-auto">

        <div className="pt-10 sm:pb-10">
          <div className="mb-4 text-lg">
            <a target="_blank" href="https://hifis.net" rel="noreferrer"
              className="hover:text-primary"
            >
              <LogoHifis />
            </a>
          </div>
          <div className="mt-8 mb-4 text-lg">
            This page is based on the Research Software Directory by
            <div>
              <a target="_blank" href="https://esciencecenter.nl" rel="noreferrer"
                className="hover:text-primary"
              >
                <LogoEscience />
              </a>
            </div>
            {/* Please use our tools!&nbsp;<Link href="/about" passHref>
              <a className="mr-2 underline">Read more</a>
            </Link> */}
          </div>
          {/* <div className="mt-4 text-sm">Copyright © {new Date().getFullYear()}</div> */}
        </div>

        <div className="pb-10 sm:pt-10">
          <div className="text-lg">Questions or comments?</div>
          <a href="mailto:support@hifis.net"
             className="flex mt-2 text-primary hover:text-white"
          >
            <Mail className="mr-2"/> support@hifis.net
          </a>

          <div className="mt-8 text-lg">Research Software Directory</div>
          <div className="flex flex-col">
            <Link href="/" passHref>
              <a className="footer-link">Home</a>
            </Link>
            <Link href="/software" passHref>
              <a className="footer-link">Software</a>
            </Link>
            <Link href="/projects" passHref>
              <a className="footer-link">Projects</a>
            </Link>
            <a href="https://research-software-directory.github.io/RSD-as-a-service"
              target="_blank"
              className="footer-link"
              rel="noreferrer">
              Technical Documention
            </a>
            <a href="https://research-software-directory.github.io/RSD-as-a-service"
              target="_blank"
              className="footer-link"
              rel="noreferrer">
              Imprint
            </a>
            <a href="https://research-software-directory.github.io/RSD-as-a-service"
              target="_blank"
              className="footer-link"
              rel="noreferrer">
              Data Protection Declaration
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

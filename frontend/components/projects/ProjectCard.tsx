import Link from 'next/link'
import {getTimeAgoSince} from '../../utils/dateFn'
import ImageAsBackground from '../layout/ImageAsBackground'
import {Project} from '../../types/Project'

export default function ProjectCard({slug,title,subtitle,image_id,updated_at,date_end}:Project) {
  // get current date
  const today = new Date()

  function renderStatus() {
    try {
      const endDate = new Date(date_end)
      if (today > endDate) return 'Finished'
      return 'Running'
    } catch (e) {
      return null
    }
  }

  function imageUrl() {
    if (image_id) return `/image/rpc/get_project_image?id=${image_id}`
    return null
  }

  function projectUrl() {
    return `/projects/${slug}/`
  }

  return (
    <Link href={projectUrl()} passHref>
      <a className={'flex flex-col lg:max-w-[48rem] lg:max-h-[15rem] bg-grey-100 text-gray-800 hover:bg-secondary hover:text-white'}>
        <article className="flex-1 md:flex px-4">
          <section className="py-4 h-[15rem] md:w-[13rem]">
            <ImageAsBackground
              alt={title}
              src={imageUrl()}
              className="flex-1 h-full"
              noImgMsg='no image'
            />
          </section>
          <section className="flex-1 flex flex-col py-4 pl-6">
            <h2
              title={title}
              className="max-h-[6rem] overflow-clip">
              {title}
            </h2>

            <p className="flex-1 py-4">
              {subtitle}
            </p>
            <div className="flex justify-between text-sm">
              <span className="last-update">
                {getTimeAgoSince(today,updated_at)}
              </span>
              <div className="flex items-start justify-center">
                {renderStatus()}
              </div>
            </div>
          </section>
        </article>
      </a>
    </Link>
  )
}
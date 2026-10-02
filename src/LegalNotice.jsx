import LegalPage from './LegalPage.jsx'

const SECTIONS = [
  {
    heading: 'About this project',
    body: 'This website is a redesign of a school project first created in November 2023, in collaboration with WoManHood. The company gave us a real brief: we attended the show, then met the performers afterwards to ask our questions. Ryan Torres redesigned and rebuilt it in 2026. It is not the official website of WoManHood, and the contact details shown on this site are fictional.',
  },
  {
    heading: 'Publisher',
    body: 'Ryan Torres, student web developer.',
  },
  {
    heading: 'Hosting',
    body: (
      <>
        Vercel Inc.
        <br />
        440 N Barranca Ave #4133, Covina, CA 91723, United States
        <br />
        <a href="https://vercel.com" target="_blank" rel="noreferrer">vercel.com</a>
      </>
    ),
  },
  {
    heading: 'Intellectual property',
    body: 'WoManHood, its name, photographs, videos and music belong to their respective authors and are used here for educational, non-commercial purposes only. The design and code of this website are the work of Ryan Torres.',
  },
  {
    heading: 'Credits',
    body: (
      <>
        Design & development: Ryan Torres
        <br />
        Typeface: Geist, by Vercel
      </>
    ),
  },
]

function LegalNotice() {
  return <LegalPage title="Legal Notice" sections={SECTIONS} />
}

export default LegalNotice

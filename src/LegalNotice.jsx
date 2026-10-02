import LegalPage from './LegalPage.jsx'

const SECTIONS = [
  {
    paragraphs: [
      'This website is a student project designed and developed by Ryan Torres. It is not the official website of WoManHood. Contact details shown on this site are fictional.',
    ],
  },
  {
    heading: 'Publisher',
    paragraphs: ['Ryan Torres, student web developer.'],
  },
  {
    heading: 'Hosting',
    paragraphs: [
      <>
        Vercel Inc.
        <br />
        440 N Barranca Ave #4133, Covina, CA 91723, United States
        <br />
        <a href="https://vercel.com" target="_blank" rel="noreferrer">vercel.com</a>
      </>,
    ],
  },
  {
    heading: 'Intellectual property',
    paragraphs: [
      'WoManHood, its name, photographs, videos and music belong to their respective authors and are used here for educational, non-commercial purposes only. The design and code of this website are the work of Ryan Torres.',
    ],
  },
  {
    heading: 'Credits',
    paragraphs: [
      <>
        Design & development: Ryan Torres
        <br />
        Typeface: Geist, by Vercel
      </>,
    ],
  },
]

function LegalNotice() {
  return <LegalPage title="Legal Notice" sections={SECTIONS} />
}

export default LegalNotice

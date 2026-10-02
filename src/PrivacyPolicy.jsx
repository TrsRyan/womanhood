import LegalPage from './LegalPage.jsx'

const SECTIONS = [
  {
    heading: 'Who we are',
    body: (
      <>
        This website presents WoManHood, a contemporary circus show. For any question about this policy, contact{' '}
        <a href="mailto:millelundt@gmail.com">millelundt@gmail.com</a>.
      </>
    ),
  },
  {
    heading: 'Data we collect',
    body: 'None. The site has no forms, no accounts, no analytics and no advertising. We do not collect, sell or share any personal data.',
  },
  {
    heading: 'Cookies and storage',
    body: 'This site sets no cookies. To return you to where you were when you move between pages, your browser keeps your scroll position for the duration of your visit (sessionStorage). It never leaves your device and is erased when you close the tab. Because it is strictly necessary for the site to work, it does not require your consent.',
  },
  {
    heading: 'Hosting',
    body: (
      <>
        The site is hosted by Vercel Inc. (United States). Like any web host, Vercel may record technical information, such as your IP address, in its server logs for security and performance purposes. See{' '}
        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel&apos;s privacy policy</a> for details.
      </>
    ),
  },
  {
    heading: 'Your rights',
    body: (
      <>
        Under the GDPR, you can ask to access, correct or delete any data concerning you, and you can lodge a complaint with your data protection authority (in France, the{' '}
        <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">CNIL</a>).
      </>
    ),
  },
  {
    heading: 'Changes',
    body: 'We may update this policy. The date at the top shows the latest version.',
  },
]

function PrivacyPolicy() {
  return <LegalPage title="Privacy Policy" intro="Last updated: October 2, 2026" sections={SECTIONS} />
}

export default PrivacyPolicy

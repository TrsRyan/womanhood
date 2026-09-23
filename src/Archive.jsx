import './App.css'
import './Archive.css'

const SITE_GRID_COLUMNS = 36

function Archive() {
  return (
    <>
      <div className="grid-overlay" aria-hidden="true">
        {Array.from({ length: SITE_GRID_COLUMNS }).map((_, index) => (
          <span key={index} className="grid-overlay__line" />
        ))}
      </div>

      <header className="site-header">
        <a href="/" className="site-header__wordmark">WoManHood</a>
        <nav className="site-header__nav">
          <button type="button" className="site-header__sound-toggle">(Sound On),</button>
          <a href="/archive.html" className="site-header__archive-link">Archive</a>
        </nav>
      </header>

      <main className="archive">
        <div className="archive__container">
          <div className="archive__credit">
            <h1 className="archive__credit-title">Archive</h1>
            <p className="archive__credit-text">
              © 2023 WoManHood
              <br />
              Mille Lundt
            </p>
          </div>

          <div className="archive__toc">
            <div className="archive__toc-links">
              <a className="archive__toc-link" href="mailto:millelundt@gmail.com">millelundt@gmail.com</a>
              <a className="archive__toc-link" href="tel:+32497976285">+32 497 97 62 85</a>
            </div>
          </div>

          <nav className="archive__nav">
            <div className="archive__nav-group">
              <p className="archive__nav-title">The Subject</p>
              <div className="archive__nav-links">
                <a className="archive__nav-link archive__nav-link--active" href="#the-oath" aria-current="location">(01) The oath</a>
                <a className="archive__nav-link" href="#a-history-of-disguise">(02) A history of disguise</a>
                <a className="archive__nav-link" href="#four-lives">(03) Four lives</a>
              </div>
            </div>

            <div className="archive__nav-group">
              <p className="archive__nav-title">The Making</p>
              <div className="archive__nav-links">
                <a className="archive__nav-link" href="#the-ethics-of-looking">(04) The ethics of looking</a>
                <a className="archive__nav-link" href="#filming-in-albania">(05) Filming in Albania</a>
                <a className="archive__nav-link" href="#building-the-piece">(06) Building the piece</a>
                <a className="archive__nav-link" href="#research-on-the-body">(07) Research on the body</a>
              </div>
            </div>

            <div className="archive__nav-group">
              <p className="archive__nav-title">The Piece</p>
              <div className="archive__nav-links">
                <a className="archive__nav-link" href="#the-stage">(08) The stage</a>
                <a className="archive__nav-link" href="#the-music">(09) The music</a>
                <a className="archive__nav-link" href="#shakespeares-viola">(10) Shakespeare&apos;s Viola</a>
                <a className="archive__nav-link" href="#facing-an-audience">(11) Facing an audience</a>
              </div>
            </div>

            <div className="archive__nav-group">
              <p className="archive__nav-title">The Record</p>
              <div className="archive__nav-links">
                <a className="archive__nav-link" href="#the-company">(12) The company</a>
                <a className="archive__nav-link" href="#credits">(13) Credits</a>
              </div>
            </div>
          </nav>

          <div className="archive__content">
            <div className="archive__article-list">
              <article className="archive__article" id="the-oath">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(01) The oath</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    In the mountains of northern Albania, a woman could swear an oath of virginity and take the place of a father or a brother who had died. From that day she held the standing of a man, and the rights that came with it. She did men&apos;s work. She dressed as a man. She was respected as the head of the family.
                  </p>
                  <p className="archive__article-paragraph">
                    The change was social, not sexual. It was also permanent. Some adapted so completely that outside their own household nobody recognised them as women any longer. Over the years, the woman in them was lost.
                  </p>
                  <p className="archive__article-paragraph">
                    They are called Burnesha, and they come from the Accursed Mountains in the far north of the country. Life there has always been harder than life further west, and that distance is part of why the decision is difficult to weigh from the outside. To refuse everything considered feminine, and to give up love, in exchange for the right to act.
                  </p>
                  <p className="archive__article-paragraph">
                    The custom has its roots in the kanun, the medieval code that governed almost every aspect of life in northern Albania and in Kosovo, and under which a woman was the property of a man. Two situations produced most of the oaths. A family could be left without men, which happened often where blood feuds killed them in sequence, and a daughter could step into the empty place so that the household could hold its land and its name. Or a young woman could refuse a marriage that had been arranged for her, sometimes promised before she was born, and the oath let her refuse without dishonouring the family she had been promised to and without setting off a feud.
                  </p>
                  <p className="archive__article-paragraph">
                    Anthropologists describe the choice as one of the most honourable a woman could make in that society, understood as the supreme sacrifice. Nobody knows exactly how many are still alive. The estimates run to a handful. Several of the women who have spoken to journalists in recent years believe the tradition will end with them.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="a-history-of-disguise">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(02) A history of disguise</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    Patriarchy is a system in which men hold the principal power over women and their families: over tradition, over law, over the division of labour, over who is educated and how far.
                  </p>
                  <p className="archive__article-paragraph">
                    Women have been dressing as men for a long time, and largely for the same reason. Female cross-dressers were already common in seventeenth century Spain, common enough that laws were passed against the practice on the grounds that the social order was under threat. Women reaching for a higher social or economic position borrowed the names of male authors. Those who lived as men were most often from the lower classes, and what the disguise bought them was economic independence and the freedom to travel, at very little risk to what they owned.
                  </p>
                  <p className="archive__article-paragraph">
                    The reaction was rarely symmetrical. A woman dressing as a man met a warmer response than a man dressing as a woman. Altenburger reads female to male cross-dressing as an avant-garde movement, measured in social status, power and freedom.
                  </p>
                  <p className="archive__article-paragraph">
                    So the Albanian oath is not an isolated custom. It is the most formal and most binding version of something that has happened wherever the exits were closed.
                  </p>
                  <p className="archive__article-paragraph">
                    Which leaves a question for the present, and it is the question the performance is built on. Is disguise still used in the same way today? What is the effect, now, when a woman carries herself like a man? What advantage does it still buy her?
                  </p>
                </div>
              </article>

              <article className="archive__article" id="four-lives">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(03) Four lives</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    The spoken text in WoManHood is drawn from testimonies collected by the photographer Pepa Hristova. On stage, the two physical performers speak them in the first person, in French, without commentary and without introduction.
                  </p>
                  <p className="archive__article-paragraph">
                    Hakije, 59. Raised as a boy from birth, because a dervish had told her parents they would have a son.
                  </p>
                  <p className="archive__article-paragraph">
                    Drande, 53. A woman who chose to live a man&apos;s life. She lost her hands as a child, playing with a grenade. After her father died, caring for her mother became a matter of honour.
                  </p>
                  <p className="archive__article-paragraph">
                    Diana, 54. She has lived as a man since she was seventeen. She would not accept that men were allowed everything and women nothing. She does not like to talk about her feelings. It would damage her standing as a man.
                  </p>
                  <p className="archive__article-paragraph">
                    Ilmije, 30. She always wanted to be free and self sufficient, and in the north only boys have the privilege of leaving the house. At five she walked out to graze the cattle without asking permission. After her mother died, and the house and her father fell to her, she decided to live as a man. She likes to ride out and collect firewood.
                  </p>
                  <p className="archive__article-paragraph">
                    Four women, and four different doors into the same decision. A prophecy made before birth. A father&apos;s death and a debt of honour. A refusal of what was permitted to men and not to women. A wish for freedom that started at five years old. The tradition is usually described as though it had a single cause. It did not.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="the-ethics-of-looking">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(04) The ethics of looking</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    The risk in this material is obvious. A tradition this rare invites the wrong kind of attention, and the company named that risk before the work began.
                  </p>
                  <p className="archive__article-paragraph">
                    The direction takes as its first principle that the piece must not place a voyeuristic or a moral gaze on these lives. Nothing is explained. Nothing is judged. The subject is approached in the negative space, through the resonance between bodies, voice, documentary and a certain theatricality, so that no single reading is imposed and no manichean version of the story is offered.
                  </p>
                  <p className="archive__article-paragraph">
                    There is a second reason for that restraint. A woman disguised as a man summons things in a spectator that have nothing to do with Albania: memories that reach back as far as Shakespeare, and much more recent ones, the games and fantasies of childhood. The performers do not close that gap. Their bodies are unlike one another, their physical and vocal range sits far outside the ordinary, and what they leave open is room for the audience to bring its own reading to the lives of these women.
                  </p>
                  <p className="archive__article-paragraph">
                    The two physical performers carry the voices of the Burnesha and try to pass them on plainly, with naturalness and simplicity, as though the words were only being lent for the evening. The singer works the other way, letting fragments arrive as spoken and slammed song, an incantation coming from the past.
                  </p>
                  <p className="archive__article-paragraph">
                    The conversation the piece stages is between recorded reality and the immediate physical fact of a body in the room. What it is finally after is an invisible exchange between those women in Albania and us today.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="filming-in-albania">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(05) Filming in Albania</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    In September 2022 the company spent ten days filming in Albania, in Tirana and in the northern mountains.
                  </p>
                  <p className="archive__article-paragraph">
                    Documentary was chosen because it makes a kind of closeness possible that staging cannot. It lets you come nearer to a place, a person, an emotion, than you would normally be allowed to come.
                  </p>
                  <p className="archive__article-paragraph">
                    The intention was not to fix the tradition in the past. It was to find how it is understood now, including by women with no connection to it: a younger generation in the capital, and women living in the region around the mountains, asked what they make of the sworn virgins and of the position of the masculine woman in Albania today.
                  </p>
                  <p className="archive__article-paragraph">
                    The audio was recorded separately from the image, so that both could be used independently at any point in the performance. That single decision shapes the whole piece. It is what lets a voice be heard without its face, and a face be seen without its voice.
                  </p>
                  <p className="archive__article-paragraph">
                    The portraits themselves are silent. People are filmed in places that carry personal weight, or that simply give the feeling of being at home. The mountains were filmed as much as the people, and they stand in the documentary as silent witnesses. In the edit, the line between the recorded faces and the landscape is deliberately blurred, so that the women and the place they live in stop being separable.
                  </p>
                  <p className="archive__article-paragraph">
                    The result was conceived less as a film than as an exhibition: image, sound, text, light and movement assembled so that each element can stand alone, support another, or exist alongside it.
                  </p>
                  <p className="archive__article-paragraph">
                    Three circus artists were filmed in Tirana: Juxhina Madhi, Sabina Troshku and Paola Dedolli. Two Burnesha were filmed, one in the northern mountains and one by the sea at Durrës.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="building-the-piece">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(06) Building the piece</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    WoManHood was made collectively. The theme was broken down into specific questions, small keys used to open the process, and the company gathered material against them: texts, songs, poems, images, anything that summoned the imagery of masculinity inside the feminine. The findings were opened up in discussion and collected in a shared dossier.
                  </p>
                  <p className="archive__article-paragraph">
                    From there almost everything passed through improvisation rather than through talk. The method was deliberately unhurried: time to experiment before fixing any scene or any narration, a preference for standing up over sitting down, and a willingness to try contradictory propositions. It is easy to sit and wonder whether an idea will work. There is only one way to find out. Some of the strongest material came out of mistakes made while improvising.
                  </p>
                  <p className="archive__article-paragraph">
                    The director&apos;s role through this was to guide and to interrogate the matter appearing on the floor: to arrive with a notion of the theme, ask questions, propose situations and test them until they became scenes.
                  </p>
                  <p className="archive__article-paragraph">
                    Fragments of ideas and of scenes were collected and assembled in various forms, so that the content and the world of the piece could be understood empirically rather than decided in advance. Sessions were filmed and discussed, then reworked dramaturgically as sequences, until the show had been thought through with care rather than assembled at speed.
                  </p>
                  <p className="archive__article-paragraph">
                    The details are what articulate the piece. Through repetition of movement and sound, the material is learned so thoroughly that performing it becomes natural. Only at that point do the performers hold the whole shape in view, and can be present inside each moment with a clear intention rather than recalling what comes next.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="research-on-the-body">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(07) Research on the body</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    The choreography starts from a narrow question: what does masculinity look like inside a female body?
                  </p>
                  <p className="archive__article-paragraph">
                    The work takes the lines of the female body and puts them into postures read as typically male, then holds the border between the two for as long as it can. Pushed far enough, the question changes shape. Underneath the gendered reading of a posture there is only physical instinct, which belongs to nobody in particular. That is the common characteristic the company went looking for.
                  </p>
                  <p className="archive__article-paragraph">
                    The research went into the fight or flight response and the autonomic system that governs it, and then into the spine, which the company treats as the longest and most flexible bone in the body and as the seat of the survival instinct. If a human being needs long stretches of calm in order to recover and to survive sudden danger, then instinct is the oldest thing in the room, older than any social reading of a gesture. Movement tied to instinct is driven from the reptilian brain, the part that governs heart rate, breathing, temperature and balance.
                  </p>
                  <p className="archive__article-paragraph">
                    The body is then treated as an object inside an architecture: skin, flesh, muscle, bone. The interest is in the precise contour of a body held in an extreme position, and in how long it resists before it collapses. Muscles are handled as building blocks, the things that keep a body strong and able to move through difficult ground.
                  </p>
                  <p className="archive__article-paragraph">
                    The choreography is built from the idea that a body is a map of constituent parts, which can be wrapped into a structure or dismantled one by one.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="the-stage">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(08) The stage</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    A black box, and almost no set. Across the back of the stage hangs a curtain of fine pale threads, covering its full width. Two long metal chains come down from the grid. Microphones are placed on the stage. The musician takes her position in the front left corner, with her instruments.
                  </p>
                  <p className="archive__article-paragraph">
                    The set is kept deliberately simple so that the space stays open, and light does the work of building it. Light is what brings the audience close to the action, and what decides how much of a body is available to be seen at any moment. The focus is meant to fall on three things only: movement, video, and the space that light creates.
                  </p>
                  <p className="archive__article-paragraph">
                    Three performers hold the stage: two women dressed as men, and one dressed with deliberate excess as a woman, brighter and sharper than the others by design. The costumes begin from the conflict between who the performers are and what a society expects to see. The body is treated as a medium, so how it is dressed matters, and the colour range is taken directly from the documentary footage, so that the bodies on stage and the images behind them belong to the same world. Each costume is judged on how it reads under particular light, on the sound it makes, and on how the performer moves inside it.
                  </p>
                  <p className="archive__article-paragraph">
                    Aerial chain and contortion move the piece between the ground and the air. The bodies read as abstract and visual, a live demonstration of what a body can do at its limit.
                  </p>
                  <p className="archive__article-paragraph">
                    The costumes are abandoned as the performance goes on, until the performers are close to bare and the lines of the body are all that is left to read. What the piece looks for there is the natural ambivalence between masculine and feminine already present in these women, with nothing added.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="the-music">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(09) The music</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    Guro Tveitnes composed the music and performs it live, with voice, autoharp and electronic effects. The score is improvised, but inside fixed rules and structures, and it is always in movement between two positions: accompanying what the performers do, or contradicting it.
                  </p>
                  <p className="archive__article-paragraph">
                    The voice is the carrying instrument. What she is after through it is the subconscious of the stories being told, and the conversion of feeling into sound. Her pedals and electronics let her strip the voice of anything human, with the freedom to return it to its pure state.
                  </p>
                  <p className="archive__article-paragraph">
                    Two texts run underneath. The first is an Albanian folk song, Të rriti nëna ty, which translates as &quot;Your mother raised you&quot;, chosen from Albanian folk music with the help of the research of Spiro J. Shetuni. The second is Viola&apos;s speech from Twelfth Night, taken apart and fragmented, sung and chanted in English.
                  </p>
                  <p className="archive__article-paragraph">
                    The gesture tied to the music is the pillar of the collaboration between the musician and the performers. The score was written in close interaction with the images and the choreography, though it can also stand on its own as a musical part. Audio recordings from the documentary run through the performance in fragments alongside live text, sometimes carried by music, sometimes by movement, sometimes by the video itself.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="shakespeares-viola">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(10) Shakespeare&apos;s Viola</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    The company uses one speech from Twelfth Night, spoken by Viola, a woman disguised as a man who has fallen in love with her master and been fallen in love with by another woman. She names the disguise as a wickedness, admits she cannot untangle what it has caused, and leaves the problem to time.
                  </p>
                  <p className="archive__article-paragraph">
                    It is four hundred years old and it is placed in the piece as a set of questions about the condition of women and about disguise, questions the company found had lost none of their currency. Broken into fragments and sung, it arrives less as a quotation than as something remembered from a long way off.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="facing-an-audience">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(11) Facing an audience</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    Living art does not exist without an audience. If a company disappeared into a rehearsal room and made only what it wanted to make, without showing anyone along the way, the real danger is that nobody would recognise themselves in the result. There is no way to know whether a piece works until it has been in front of people. The artistic vision matters, but it is what allows a conversation with an audience to run through the whole creation rather than begin at the end. Taking the pulse of the material as you go is how you learn whether a piece holds emotionally as well as structurally.
                  </p>
                  <p className="archive__article-paragraph">
                    WoManHood is for audiences from twelve years old. The question of gender can be asked at any age. When do we feel more masculine, or more feminine? It is a dialogue worth opening, and art is a reasonable place to open it. It is worth opening early too, with an audience still building its own identity.
                  </p>
                  <p className="archive__article-paragraph">
                    The piece is not a thesis. It is a small opening onto a question of identity, one that breaks with the ordinary and asks what it costs to be non ordinary. It is made for a wide audience, young and less young, as an open space where what is seen, heard and performed can make you laugh, make you feel, and turn a question back on you.
                  </p>
                  <p className="archive__article-paragraph">
                    Circus is what makes that possible. Its skills carry a relation to the impossible and to the poetic that ordinary speech does not have, and sound and light build the hearth, the place where an audience becomes willing to feel something.
                  </p>
                  <p className="archive__article-paragraph">
                    WoManHood is looking for an unusual encounter with disguise. To dare to be someone or something else, to be more, to be different, atypical, and for some to lead a life others will call grotesque. That is where the term contemporary circus earns its place, as a permanent break with an ordinary art form.
                  </p>
                  <p className="archive__article-paragraph">
                    Is there a limit? Who set it?
                  </p>
                </div>
              </article>

              <article className="archive__article" id="the-company">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(12) The company</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    Mille Lundt — Concept, idea, contortionist and performer. Born in Copenhagen. She studied theatre there from 1995 and moved to circus in 1998, training at AFUK in Copenhagen and at the national circus schools of Havana, Moscow and Kiev, before graduating from ESAC in Brussels in 2006. She works at the intersection of performance, circus, visual art, sound and photography, and at the centre of that work is the use of her own body as a living instrument of investigation and creation. The advantage a woman can gain from masculine behaviour has been at the centre of her research for years, as an artist and personally.
                  </p>
                  <p className="archive__article-paragraph">
                    Delphine Lanson — Direction. Born in Paris. Actress, director and filmmaker, and a graduate of the London International School of Acting. She has always looked for a balance between her disciplines, holding that the arts complete one another in the service of a shared creativity, and she actively pursues that with circus artists, filmmakers, writers and actors. She had already worked on gender in Naître père, a documentary about a couple of gay parents.
                  </p>
                  <p className="archive__article-paragraph">
                    Anke Fiévez — Aerial artist and performer. Born in Germany, based in Brussels. She discovered the pleasure of mastering her own body early, alongside acting, and found circus at fifteen in a workshop. She left Germany after her final exams for ESAC in Brussels. Some years ago she fell for a new apparatus: it is on lifting chains that she meets new limits and lets certain borders inside her dissolve. The position of women in society, and questions of identity and gender, have concerned her for as long as she can remember, professionally as much as personally.
                  </p>
                  <p className="archive__article-paragraph">
                    Guro Tveitnes — Singer and composer. She grew up beside a fjord in Norway. Her training runs from classical and musical theatre through folk and pop to free jazz and experimental music. She began her studies at the Rhythmic Music Conservatory in Copenhagen in 2009 and took a Master of Music there in 2014. At RMC she founded the experimental vocal ensemble IKI with eight other singers, since become one of the leading improvising vocal ensembles in Europe. She works to bring down the barriers between genres, and to widen the understanding of what a singer can do.
                  </p>
                  <p className="archive__article-paragraph">
                    Hugues Girard — Light design and technical direction. French, and a stage manager for some fifteen years. He has moved between artistic worlds across creations and festivals, from dance to theatre by way of circus and opera. Years of specialisation aimed at new learning have given him a technical range wide enough to answer increasingly complex creative demands, covering light design, set construction, sound experimentation and human flight.
                  </p>
                </div>
              </article>

              <article className="archive__article" id="credits">
                <header className="archive__article-header">
                  <h2 className="archive__article-title">(13) Credits</h2>
                </header>

                <div className="archive__article-body">
                  <p className="archive__article-paragraph archive__article-paragraph--first">
                    Concept and idea Mille Lundt. Direction Delphine Lanson. Aerial artist and performer Anke Fiévez. Contortionist and performer Mille Lundt. Singer and composer Guro Tveitnes. Light design and technical direction Hugues Girard. Video Pepa Hristova, Danail Yankov, Delphine Lanson. Production and touring Mille Lundt.
                  </p>
                  <p className="archive__article-paragraph">
                    Documentary cast — circus artists in Tirana: Juxhina Madhi, Sabina Troshku, Paola Dedolli. Burnesha in the northern mountains: Augustina Grishaj (Duni). Burnesha by the sea in Durrës: Diana Rakipi (Lali). Photograph of the Burnesha Qamile used in the documentary: Jutta Bentzenberg.
                  </p>
                  <p className="archive__article-paragraph">
                    Co-production UP – Circus &amp; Performing Arts, Théâtre National Wallonie-Bruxelles. Support Fédération Wallonie-Bruxelles, service des Arts du Cirque, Rue, Forains. Residencies UP – Circus &amp; Performing Arts, Théâtre National Wallonie-Bruxelles, Wolubilis, Dommelhof, l&apos;Ancien Carmel, Château de Monthelon.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer__legacy">
          <p>© 2023 Womanhood</p>
          <a href="/archive.html">Cookie Preferences</a>
          <a href="/archive.html">Privacy Policy</a>
        </div>

        <span className="site-footer__wordmark-clip">
          <span className="sr-only">WoManHood</span>
        </span>
      </footer>
    </>
  )
}

export default Archive

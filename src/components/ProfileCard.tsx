import Image from "next/image";
import { PROFILE } from "@/data/profile";
import { CopyRiotId } from "./CopyRiotId";

export function ProfileCard() {
  return (
    <section className="profile" aria-labelledby="profile-name">
      <div className="profile__card">
        <div className="profile__portrait">
          <Image
            src={PROFILE.photo}
            alt={PROFILE.photoAlt}
            fill
            sizes="(max-width: 560px) 160px, 220px"
            priority
            // why: the source is 720×1280 portrait; 36% from the top centres the face
            // while keeping the headset and the smile inside the square crop.
            style={{ objectFit: "cover", objectPosition: "50% 36%" }}
          />
        </div>
        <div className="profile__body">
          <div className="profile__id">
            <h2 id="profile-name" className="profile__name">
              {PROFILE.name}
              <span className="profile__tag">{PROFILE.tag}</span>
            </h2>
            <CopyRiotId riotId={`${PROFILE.name}${PROFILE.tag}`} />
          </div>
          <p className="profile__since">{PROFILE.since}</p>
          <p className="profile__mastery">
            <span className="profile__mastery-row">
              <strong>{PROFILE.mastery}</strong>
              <span className="mastery-badge">
                <img className="mastery-badge__aura" src="/images/mastery-aurora.png" alt="" aria-hidden="true" />
                <img
                  className="mastery-badge__crest"
                  src="/images/mastery-10.png"
                  alt="Emblema de maestria do League of Legends"
                  width={96}
                  height={108}
                />
              </span>
            </span>
            <span className="profile__mastery-label">{PROFILE.masteryLabel}</span>
          </p>
          <blockquote className="profile__quote">“{PROFILE.quote}”</blockquote>
        </div>
        <div className="profile__side">
            <p className="profile__rank">
              <img
                className="profile__rank-icon"
                src={PROFILE.rankIcon}
                alt={`Emblema ranqueado ${PROFILE.rank}`}
                width={88}
                height={54}
              />
              <span className="profile__rank-text">
                <span>Rank atual</span>
                <strong>{PROFILE.rank}</strong>
              </span>
            </p>
        </div>
      </div>
    </section>
  );
}

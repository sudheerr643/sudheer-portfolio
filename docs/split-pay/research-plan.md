# Split Pay for group movie bookings — research plan

Unofficial concept for BookMyShow. Not affiliated with or endorsed by BookMyShow.

## 1. Problem statement (hypothesis — validate before publishing)

When friends go to a movie together, one person books every seat and pays the full amount, then spends hours or days collecting money over UPI. The organiser carries the financial risk and the awkward follow-ups; friends have no stake until they've paid, so plans stay loose until the last minute.

**How might we** let a group lock seats together and each pay for their own seat, without making booking slower for the organiser?

## 2. Hypotheses to test

| # | Hypothesis | How we'll know |
|---|---|---|
| H1 | Most group bookings are paid by one person who later collects money | Survey Q3–Q5 |
| H2 | Collecting money takes long enough to be annoying, and sometimes never completes | Survey Q6–Q7, interviews |
| H3 | Organisers delay booking until everyone confirms, and lose good seats | Survey Q8, interviews |
| H4 | Friends would pay their share immediately if it took one tap and no app | Survey Q9, usability test |
| H5 | A short seat hold (≈10 min) is enough for most groups | Usability test timings |

## 3. Desk research (do first, ~2 hours)

- Play Store / App Store reviews of movie-booking apps: search "split", "friends", "group", "pay for others". Note themes; screenshot 4–6 representative reviews (anonymise names).
- Reddit / X threads: "who pays for movie tickets with friends", "collecting money UPI friends".
- Competitive scan: how other apps handle group payments (Airbnb split payments, Splitwise, UPI "split bill", food-delivery group ordering). Note what to borrow and what to avoid.

## 4. Survey (Google Form, target 30–50 responses, 18–35 urban movie-goers)

1. How often do you go to the movies with 3 or more friends? (Never / Few times a year / Monthly / More)
2. Who usually books the tickets in your group? (Me / Same friend / Whoever's free / We book separately)
3. When one person books for everyone, how is the money settled? (UPI later / Cash / Splitwise / Never settled / Other)
4. Have you ever booked for a group and not been paid back in full? (Yes / No / Can't remember)
5. Roughly how long does it take to get everyone's money back? (Same day / 1–3 days / A week+ / Some never pay)
6. How do you feel about chasing friends for money? (1–5: not at all awkward → very awkward)
7. Have you delayed booking because friends hadn't confirmed? Did you lose seats you wanted? (Yes, lost seats / Yes, but fine / No)
8. If a booking app let each friend pay for their own seat from a link (no app needed), would you use it? (1–5)
9. What would worry you about it? (open text)
10. If a friend doesn't pay in time, what should happen to their seat? (Release it / I'll cover it / Ask me / Other)

## 5. Interviews (5–6 people, 20 min each)

Mix: 3 people who usually organise, 2–3 who usually get booked for.

- Walk me through the last time you went to a movie with a group. Who booked? How did money work?
- What was the most annoying part?
- Has a plan ever fallen apart because of tickets or money? What happened?
- (Organisers) How do you decide when to book — before or after everyone confirms?
- (Friends) When someone books for you, when do you usually pay them back? Why then?
- Show the invite screen (F1): what would you do here? What's unclear?

## 6. Usability test (5 people, prototype)

Tasks:
1. Organiser: book 6 seats and split them with friends. (Success = invites sent with own share paid)
2. Friend: you got this link — pay for your seat. (Success = paid; measure time)
3. Organiser: 2 friends haven't paid and the hold is ending — what do you do?
4. Friend: you can't make it after paying — cancel your seat.

Record: task success, time on task, hesitation points, quotes.
Baseline to compare: today's flow (one person pays → sends UPI requests), timed with the same participants.

## 7. Metrics the feature should move (for the business case)

- Group booking conversion (seat selection → paid) for parties of 3+
- Abandoned seat selections on large groups
- Average tickets per transaction
- New users acquired through invite links (friends paying from the web link)
- Support contacts about group refunds

## 8. Status

Desk research is done and published on the case study (sources in `desk-research.md`). The survey, interviews and usability test above are optional next steps — if you run them, add the results to the Research section of `app/split-pay/page.tsx` alongside the desk findings.

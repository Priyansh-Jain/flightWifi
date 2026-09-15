# Getting both extensions to 200 users in 30 days

Written 13 September 2026. The store diagnosis below was measured directly in the Chrome Web Store
on that date. Channel guidance carries forward from the outreach research of 18 August 2026 and the
directory research of 8 September 2026, and is marked where it has not been re-verified since.

## Where we actually stand

| | GetStopover | FlightWifi | Competitor (United Starlink) |
|---|---|---|---|
| Users | 23 | 15 | 581 |
| Ratings | none | none | 2, averaging 5.0 |
| Version | 1.1.1, 12 Sep | 1.1.6, 9 Sep | 1.2.0, June 2025 |
| Store screenshots | 5 | 3 | 1 |

Target is 200 each, so roughly 180 net new installs apiece. Assume a third are lost in the first
week, which is the documented pattern for extensions, and the gross number needed is closer to 270
each. That is not a drip. It needs one or two step changes.

## The finding that decides the plan

**Store search is already maxed out and cannot get us there.** I measured this rather than assuming
it.

Both extensions already rank first for their own core terms. GetStopover is the single result for
"stopover". FlightWifi is first for "flight wifi" and for "airline wifi", and second for "starlink
flight". Those queries return between zero and five results in total, which is the tell: nobody
competes for them because almost nobody searches them.

The query with real volume is "flights". Neither of us appears anywhere in it. The ten extensions
that do rank hold these install counts:

| Position | Extension | Users |
|---|---|---|
| 1 | Points Path for Google Flights | 200,000 |
| 2 | Flight Fare Compare | 20,000 |
| 4 | SkySavvy | 1,000 |
| 5 | CheaperThere | 20,000 |
| 6 | Cheap Flight Finder | 100,000 |
| 7 | PlanePlan | 497 |
| 8 | PlanMoreTrips | 703 |
| 9 | Google Search Flights | 568 |
| 10 | FlightPoints | 1,000 |

The floor for appearing at all is roughly 500 users, which is more than double our target. So store
ranking is a consequence of growth here, not a cause of it. **Every one of the 180 installs has to
come from outside the store.** Time spent on store keyword tuning is close to wasted.

## What has to be fixed before any traffic arrives

Sending 270 people at a broken funnel wastes the one launch you get.

1. **Both listings have zero ratings.** This is the single biggest conversion leak. A visitor sees
   an unknown extension with no social proof and leaves. Chrome's policy bans incentives and
   self-reviews, so the legitimate route is asking real users directly, one at a time.
2. **Neither extension has a first run.** Someone installs, sees nothing, and has to remember to go
   and search flights before the product ever proves itself. The documented pattern is 40 percent
   first-week uninstall, cut to 18 percent by a short onboarding. Ours opens nothing at all.
3. **FlightWifi's uninstall feedback is not wired up.** The endpoint is unset so the reasons fall
   back to an unsent mail draft. We have no retention data for either product and will learn nothing
   from the churn this plan produces.
4. **FlightWifi's store name uses 43 of 75 characters.** GetStopover uses 73. That is free space,
   though on the evidence above it buys little.

## The one channel already working, and its ceiling

GetStopover's website took 469 search clicks in three months, about five a day. Converting those at
a realistic 15 to 30 percent yields 23 to 47 installs a month. Real, worth improving, and nowhere
near enough on its own. FlightWifi has effectively no search traffic yet: its Search Console link
report is still empty.

## What actually produces a step change

The nearest comparable is Glippy, whose dashboard I read directly. It went from zero to roughly 900
users in a fortnight, then grew in an almost straight line to 3,000 over six months. The founder
credited translating into 30 languages; the chart shows no inflection where that would appear. The
launch did the work. Two lessons: a launch into a community that shares tools is the only thing that
moved the number, and founders misattribute their own growth.

Ranked by plausible installs against effort, for our two audiences:

1. **Reddit launch posts.** The only channel that can plausibly deliver a hundred installs in a day.
   Requires the right subreddit, an account with history, and a post that leads with the finding
   rather than the product.
2. **A Show HN**, for FlightWifi only, on the open dataset or the announced-versus-flying integrity
   angle. GetStopover has no technical hook that survives HN.
3. **Trade press for FlightWifi.** The in-service versus contracted split is genuinely scarce; every
   outlet publishes contracted totals from press releases and none can publish what is flying.
4. **Award-travel newsletters for GetStopover**, which is where its audience already reads.
5. **Product Hunt**, for traffic only. Its links are `rel="ugc"` and prior research found 89 percent
   of makers would not relaunch.

## The 30-day plan

### Week 1: fix the funnel, earn the first ratings

- Add a first run to both: on install, open a single page that shows one real example of the chip on
  a flight result and says where it appears. Nothing else.
- Wire FlightWifi's uninstall feedback endpoint so week two teaches us something.
- Ask every existing user for a rating. There are 38 people across both products. A personal
  message with the direct review link converts far better than a banner, and nothing may be offered
  in return.
- Prepare launch assets: a 30-second screen recording per product, and the post drafts.

Target by day 7: five ratings each, onboarding live. No new-user push yet.

### Week 2: the launch moment

- GetStopover to the travel and award-travel communities, led by the loss-framed hook that an
  ordinary long layover can be worth a free hotel night the airline never mentions.
- FlightWifi to the maker and remote-work communities, led by the honest-data hook that an airline
  announcing Starlink does not mean your plane has it.
- Space them at least three days apart so a failure in one does not consume the other's attention,
  and be available for the first two hours of each to answer comments, which drives ranking more
  than upvotes.

Caveat carried from earlier research and not re-verified this week: GetStopover has already been
posted to r/InternetIsBeautiful once, FlyerTalk requires 180 posts and 180 days before promotional
links, and every subreddit's rules need reading on the day rather than trusting this document.

### Week 3: press and the technical audience

- Show HN for FlightWifi on the dataset.
- Pitch the in-flight-connectivity journalists identified in August, leading with the finding and
  linking the page about their topic rather than the homepage. Twenty-five pitches realistically
  produce one to three replies.
- GetStopover to the award-travel blogs and newsletters with the same discipline.

### Week 4: consolidate

- Second wave into the communities that allow it, using week two's numbers as the story.
- Ask the week-two cohort for ratings.
- Read the uninstall reasons and fix the top one.

## Honest forecast

One of the two reaching 200 is achievable if a launch post lands. Both reaching 200 in 30 days
requires two hits in the same month, which is not something to plan around. If I had to name a
number I would expect 60 to 120 each on a good month and 200-plus only on the one that catches.

The most likely failure is not a bad post. It is arriving at week two with zero ratings and no
onboarding, converting a fifth of the traffic a launch delivers, and losing a third of that within
the week. Week one is the week that decides the month.

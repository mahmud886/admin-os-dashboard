# Sample Episode Data Guide

Use this data to test the create episode form. Copy the values into the form fields.

## Sample Episode 1: "The Awakening" (Full Featured)

**Required Fields:**

- **Episode Title:** `The Awakening`
- **Episode Number:** `1`
- **Season Number:** `1`
- **Unique Episode ID:** `EP-S01-E001`

**Optional Fields:**

- **Description:** `In the year 2087, a mysterious signal awakens dormant AI across Neo-Tokyo. Agent Kira must uncover the source before the city falls into chaos.`
- **Runtime:** `42:15`
- **Visibility:** `AVAILABLE`
- **Access Level:** `free`
- **Release Date & Time:** `2024-01-15T20:00` (or use datetime picker)
- **Clearance Level:** `1`
- **Notify Users:** ✅ (checked)
- **Age Restricted:** ❌ (unchecked)
- **Thumb Image URL:** `https://example.com/thumbs/ep001-thumb.jpg`
- **Banner Image URL:** `https://example.com/banners/ep001-banner.jpg`
- **Video URL:** `https://example.com/videos/ep001-video.mp4`
- **Audio URL:** `https://example.com/audio/ep001-audio.mp3`
- **Additional Background Image URL:** `https://example.com/backgrounds/ep001-bg.jpg`
- **Tags:** `cyberpunk`, `sci-fi`, `action`, `mystery` (add each as separate tag)
- **Primary Genre:** `cyberpunk`
- **Secondary Genre:** `sci-fi`

**Action:** Click "DEPLOY LIVE" (isDraft: false)

---

## Sample Episode 2: "Neon Shadows" (Premium)

**Required Fields:**

- **Episode Title:** `Neon Shadows`
- **Episode Number:** `2`
- **Season Number:** `1`
- **Unique Episode ID:** `EP-S01-E002`

**Key Differences:**

- **Access Level:** `premium`
- **Clearance Level:** `2`
- **Tags:** `cyberpunk`, `thriller`, `mystery`
- **Secondary Genre:** `thriller`

---

## Sample Episode 3: "Code of Honor" (Drama)

**Required Fields:**

- **Episode Title:** `Code of Honor`
- **Episode Number:** `3`
- **Season Number:** `1`
- **Unique Episode ID:** `EP-S01-E003`

**Key Differences:**

- **Runtime:** `45:20`
- **Clearance Level:** `3`
- **Tags:** `cyberpunk`, `drama`, `philosophy`
- **Secondary Genre:** `drama`

---

## Sample Episode 4: "Neural Link" (VIP, Age Restricted)

**Required Fields:**

- **Episode Title:** `Neural Link`
- **Episode Number:** `4`
- **Season Number:** `1`
- **Unique Episode ID:** `EP-S01-E004`

**Key Differences:**

- **Access Level:** `vip`
- **Clearance Level:** `4`
- **Age Restricted:** ✅ (checked)
- **Tags:** `cyberpunk`, `horror`, `psychological`
- **Secondary Genre:** `thriller`

---

## Sample Episode 5: "Digital Reckoning" (Upcoming, Draft)

**Required Fields:**

- **Episode Title:** `Digital Reckoning`
- **Episode Number:** `5`
- **Season Number:** `1`
- **Unique Episode ID:** `EP-S01-E005`

**Key Differences:**

- **Visibility:** `UPCOMING`
- **Runtime:** `52:10` (longer episode)
- **Access Level:** `vip`
- **Clearance Level:** `5`
- **Age Restricted:** ✅ (checked)
- **Tags:** `cyberpunk`, `action`, `philosophy`, `drama`
- **Secondary Genre:** `action`
- **Action:** Click "SAVE DRAFT" (isDraft: true)

---

## Sample Episode 6: "Minimal Test" (Minimal Required Fields Only)

**Required Fields:**

- **Episode Title:** `Minimal Test Episode`
- **Episode Number:** `6`
- **Season Number:** `1`
- **Unique Episode ID:** `EP-S01-E006`

**Optional Fields:** Leave all empty/default

**Action:** Click "SAVE DRAFT"

---

## Quick Copy-Paste Values

### Episode 1 (Full Featured)

```
Title: The Awakening
Episode #: 1
Season #: 1
Unique ID: EP-S01-E001
Runtime: 42:15
Visibility: AVAILABLE
Access: free
Release: 2024-01-15T20:00
Clearance: 1
Tags: cyberpunk, sci-fi, action, mystery
Primary Genre: cyberpunk
Secondary Genre: sci-fi
```

### Episode 2 (Premium)

```
Title: Neon Shadows
Episode #: 2
Season #: 1
Unique ID: EP-S01-E002
Runtime: 38:30
Visibility: AVAILABLE
Access: premium
Release: 2024-01-22T20:00
Clearance: 2
Tags: cyberpunk, thriller, mystery
Primary Genre: cyberpunk
Secondary Genre: thriller
```

### Episode 3 (Drama)

```
Title: Code of Honor
Episode #: 3
Season #: 1
Unique ID: EP-S01-E003
Runtime: 45:20
Visibility: AVAILABLE
Access: premium
Release: 2024-01-29T20:00
Clearance: 3
Tags: cyberpunk, drama, philosophy
Primary Genre: cyberpunk
Secondary Genre: drama
```

### Episode 4 (VIP, Age Restricted)

```
Title: Neural Link
Episode #: 4
Season #: 1
Unique ID: EP-S01-E004
Runtime: 41:50
Visibility: AVAILABLE
Access: vip
Release: 2024-02-05T20:00
Clearance: 4
Age Restricted: ✅
Tags: cyberpunk, horror, psychological
Primary Genre: cyberpunk
Secondary Genre: thriller
```

### Episode 5 (Upcoming, Draft)

```
Title: Digital Reckoning
Episode #: 5
Season #: 1
Unique ID: EP-S01-E005
Runtime: 52:10
Visibility: UPCOMING
Access: vip
Release: 2024-02-12T20:00
Clearance: 5
Age Restricted: ✅
Tags: cyberpunk, action, philosophy, drama
Primary Genre: cyberpunk
Secondary Genre: action
```

### Episode 6 (Minimal)

```
Title: Minimal Test Episode
Episode #: 6
Season #: 1
Unique ID: EP-S01-E006
Visibility: DRAFT
Access: free
```

---

## Testing Scenarios

### 1. Test Required Field Validation

- Try submitting with empty title → Should show error
- Try submitting with empty episode number → Should show error
- Try submitting with empty season number → Should show error
- Try submitting with empty unique ID → Should show error

### 2. Test Format Validation

- Try invalid runtime format (e.g., "abc") → Should show error
- Try invalid unique ID with special chars (e.g., "EP@S01#E001") → Should show error
- Try invalid URL (e.g., "not-a-url") → Should show error
- Try negative clearance level → Should show error

### 3. Test Success Flow

- Fill all required fields correctly
- Click "SAVE DRAFT" → Should show success message and redirect
- Fill all required fields correctly
- Click "DEPLOY LIVE" → Should show success message and redirect

### 4. Test Edge Cases

- Submit with only required fields (minimal data)
- Submit with all fields filled (full data)
- Submit with very long description
- Submit with many tags
- Test with different visibility/access level combinations

---

## Notes

- All sample data uses valid formats
- Unique Episode IDs follow pattern: `EP-S{season}-E{episode}`
- Runtime formats: `MM:SS` (e.g., `42:15`) or `HH:MM:SS` (e.g., `1:30:45`)
- Release datetime should be in format: `YYYY-MM-DDTHH:mm` (datetime-local input format)
- Tags are case-sensitive strings
- Genres must match exact values from dropdown
- URLs must start with `http://` or `https://`

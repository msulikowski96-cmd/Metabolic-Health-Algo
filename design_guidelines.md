# MetabolicAI Design Guidelines

## 1. Brand Identity

**Purpose**: MetabolicAI demystifies personal health metrics for Polish users, transforming clinical calculations into actionable insights.

**Aesthetic Direction**: **Soft & Scientific** – Calming pastel gradients meet precise data visualization. The app feels like a trustworthy health companion, not a sterile medical tool. Think gentle curves, breathing room, and data that feels human.

**Memorable Element**: Soft gradient cards that subtly shift color based on health zones (green for optimal, amber for attention needed). Data feels alive, not static.

## 2. Navigation Architecture

**Type**: Single-Page Web Application with scroll sections

**Sections**:
1. **Hero/Input Form** - Landing section where users enter metrics
2. **Results Dashboard** - Calculated BMI, BMR, TDEE with visual indicators
3. **Recommendations** - Personalized guidance based on results
4. **Footer** - Privacy policy, contact

**User Flow**: 
- User lands → fills form → scrolls to see results → reviews recommendations
- "Calculate Again" button returns to top with smooth scroll

## 3. Screen-by-Screen Specifications

### Hero/Input Form Section
**Purpose**: Capture user data (height, weight, age, gender, activity level)

**Layout**:
- Centered content, max-width 600px
- Logo and tagline at top
- Form fields in card with soft shadow
- Gradient background (pastel green to lavender)

**Components**:
- Text inputs: Height (cm), Weight (kg), Age
- Radio buttons: Gender (Płeć: Kobieta/Mężczyzna)
- Dropdown: Activity level (5 options from sedentary to very active)
- Primary button: "Oblicz moje wskaźniki" (Calculate my metrics)

**Validation**: Real-time feedback with gentle orange borders for incomplete fields

### Results Dashboard Section
**Purpose**: Display calculated metrics with context

**Layout**:
- Three gradient cards in responsive grid (stack on mobile)
- Each card shows: metric name, value, zone indicator, brief explanation
- Soft shadows, rounded corners (16px)

**Components**:
- BMI card (background: soft blue gradient)
  - Large number display
  - Zone badge (Niedowaga/Norma/Nadwaga/Otyłość)
  - Visual bar indicator
- BMR card (background: soft mint gradient)
  - Calorie number with kcal label
  - Subtitle: "Twoje podstawowe spalanie"
- TDEE card (background: soft peach gradient)
  - Calorie range
  - Activity multiplier note

### Recommendations Section
**Purpose**: Provide actionable health guidance

**Layout**:
- Stacked recommendation cards
- Each card has icon, title, body text
- Subtle border-left accent in brand color

**Components**:
- 3-5 recommendation cards based on results
- Icons from Feather (Activity, Heart, Coffee, Moon)
- "Zapisz wyniki" (Save results) button - downloads PDF

**Empty State**: N/A (section only appears after calculation)

## 4. Color Palette

**Primary**: `#6B9E78` (Sage green - trust, health, growth)
**Accent**: `#E8A87C` (Warm peach - attention, warmth)
**Background**: `#FAFBFC` (Soft off-white)
**Surface**: `#FFFFFF` (Pure white for cards)
**Text Primary**: `#2C3E50` (Deep blue-grey)
**Text Secondary**: `#7F8C8D` (Medium grey)
**Success**: `#27AE60` (Healthy green)
**Warning**: `#F39C12` (Attention orange)
**Error**: `#E74C3C` (Alert red)

**Gradients**:
- Hero: `linear-gradient(135deg, #A8E6CF 0%, #DCD0FF 100%)`
- BMI card: `linear-gradient(135deg, #CEE5F2 0%, #ACCBEE 100%)`
- BMR card: `linear-gradient(135deg, #D4F1E3 0%, #A8E6CF 100%)`
- TDEE card: `linear-gradient(135deg, #FFE6D5 0%, #FFD1BA 100%)`

## 5. Typography

**Font**: Inter (Google Font) – clean, legible, modern warmth

**Type Scale**:
- Heading 1 (Hero): 48px/1.2, Weight 700
- Heading 2 (Section): 36px/1.3, Weight 600
- Heading 3 (Card title): 24px/1.4, Weight 600
- Body Large: 18px/1.6, Weight 400
- Body: 16px/1.6, Weight 400
- Caption: 14px/1.5, Weight 400
- Label: 14px/1.4, Weight 500

## 6. Visual Design

**Cards**: 16px border-radius, subtle shadow (`0 2px 8px rgba(0,0,0,0.06)`)
**Buttons**: 
- Primary: `#6B9E78` background, white text, 12px border-radius, hover darkens 10%
- Secondary: White background, `#6B9E78` border, hover fills with primary
**Inputs**: 
- Border: `#E0E6ED`, 10px radius
- Focus: `#6B9E78` border, no outline
- Padding: 14px 16px
**Icons**: Feather icons, 24px, `#6B9E78` color
**Spacing**: Base 8px grid (8, 16, 24, 32, 48, 64px)

## 7. Assets to Generate

**logo.svg** - MetabolicAI wordmark with subtle leaf/heart hybrid icon
- WHERE USED: Top of hero section, footer

**empty-form.png** - Illustration of abstract human silhouette with measurement lines (pastel style)
- WHERE USED: Background decoration in hero section (opacity 0.15)

**results-celebration.png** - Abstract celebration illustration (confetti, gentle colors)
- WHERE USED: Appears briefly when results are calculated (animation)

**health-zones.svg** - Minimalist icon set for recommendation categories (nutrition, exercise, sleep, hydration)
- WHERE USED: Left side of recommendation cards

**mobile-mockup.png** - Phone displaying the app interface
- WHERE USED: Optional marketing section at bottom

All illustrations should use pastel colors from the gradient palette, simple geometric shapes, and avoid photorealistic elements.
# StudyMate — Design System & UI Specification

## 1. Design Philosophy

StudyMate should look like a serious software product built by an experienced software engineer.

The design must be:

- Clean
- Professional
- Calm
- Functional
- Accessible
- Consistent
- Responsive
- Information-focused

The interface should communicate trust and usability rather than visual effects.

## 2. Design Principles

### Principle 1 — Content First

The document and conversation are the most important elements.

Do not allow decorative elements to compete with:

- Uploaded documents
- Questions
- Answers
- Sources

### Principle 2 — Minimal Visual Noise

Avoid unnecessary:

- Gradients
- Decorative backgrounds
- Floating shapes
- Excessive shadows
- Excessive animations
- Neon effects
- Glassmorphism
- 3D effects

Do not use a generic "AI purple/blue gradient" aesthetic.

### Principle 3 — Professional Software UI

The interface should feel closer to a modern developer tool or productivity application than a marketing website.

Use:

- Neutral backgrounds
- Strong typography
- Clear borders
- Subtle elevation
- Consistent spacing
- Restrained accent color

## 3. Color System

Use a neutral color palette.

Primary background:

```text
#FFFFFF
```

Secondary background:

```text
#F8FAFC
```

Primary text:

```text
#111827
```

Secondary text:

```text
#6B7280
```

Border:

```text
#E5E7EB
```

Primary action:

```text
#111827
```

Primary action text:

```text
#FFFFFF
```

Success:

```text
#15803D
```

Error:

```text
#DC2626
```

Warning:

```text
#D97706
```

Do not create gradients.

## 4. Typography

Use a clean sans-serif font.

Preferred:

```text
Inter
```

Fallback:

```text
system-ui
```

Hierarchy:

```text
Page heading
↓
Section heading
↓
Body
↓
Secondary information
↓
Metadata
```

Avoid excessively large marketing-style headings.

## 5. Layout

Desktop:

```text
┌──────────────────────────────────────────────┐
│ Navbar                                       │
├──────────────────────────────────────────────┤
│                                              │
│ Upload / Document Area                       │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│ Chat                                         │
│                                              │
│                                              │
├──────────────────────────────────────────────┤
│ Message Input                                │
└──────────────────────────────────────────────┘
```

The application should use a centered content area.

Maximum content width:

```text
1200px
```

## 6. Navbar

Keep the navbar simple.

Left:

```text
StudyMate
```

Optional subtitle:

```text
AI Study Assistant
```

Right:

```text
Documents
About
```

Do not overcrowd the navigation.

## 7. Upload Area

The upload area should be clearly visible when no document exists.

Use a bordered container.

Example:

```text
┌─────────────────────────────────────────┐
│                                         │
│              Upload PDF                 │
│                                         │
│       Drag and drop your file here      │
│       or browse from your computer      │
│                                         │
│              PDF only • 10 MB            │
│                                         │
└─────────────────────────────────────────┘
```

Use a subtle dashed border.

Do not use large illustrations.

## 8. Processing State

When processing:

```text
Processing document

Extracting text...
Creating embeddings...
Preparing knowledge base...
```

Show one clear progress/loading indicator.

Do not show fake percentage progress unless the backend actually provides progress.

## 9. Document Card

After processing:

```text
┌──────────────────────────────────┐
│ PDF                              │
│                                  │
│ DBMS Unit 1.pdf                  │
│ 25 pages                         │
│                                  │
│ ✓ Ready                          │
└──────────────────────────────────┘
```

Use compact metadata.

## 10. Chat Interface

The chat should be the primary interaction after a document is ready.

User messages:

- Align to the right.
- Use a subtle filled container.

Assistant messages:

- Align to the left.
- Use a clean readable container.
- Avoid excessive card styling.

The answer should be easy to scan.

## 11. Answer Formatting

AI responses should support:

- Paragraphs
- Bullet points
- Numbered lists
- Code blocks where appropriate
- Bold emphasis

Avoid rendering long unformatted text.

## 12. Sources

Sources should be visible but secondary.

Example:

```text
Sources

DBMS Unit 1.pdf · Page 12
"Normalization organizes data to reduce..."
```

Sources should not dominate the answer.

Use expandable source sections if necessary.

## 13. Input Area

Use a fixed/sticky input area near the bottom of the chat.

Example:

```text
┌─────────────────────────────────────────────┐
│ Ask a question about your document...   ➤  │
└─────────────────────────────────────────────┘
```

Requirements:

- Clear focus state
- Disabled state while processing
- Enter sends
- Shift + Enter creates a new line

## 14. Buttons

Primary buttons:

- Clear
- Strong contrast
- Compact
- Clear action label

Examples:

```text
Upload PDF
Ask
Clear Chat
```

Avoid buttons with vague labels such as:

```text
Let's Go
Explore
Magic
Generate
```

## 15. Icons

Use icons only when they improve recognition.

Use:

```text
lucide-react
```

Examples:

- Upload
- File
- Send
- Trash
- Alert
- Check
- Loader

Do not place icons next to every piece of text.

## 16. Borders and Shadows

Prefer borders over shadows.

Use subtle shadows only where needed.

Example:

```text
border: 1px solid #E5E7EB
```

Avoid:

- Heavy shadows
- Neon borders
- Glow effects

## 17. Border Radius

Use moderate radius.

Suggested:

```text
6px
8px
10px
```

Avoid making every component excessively rounded.

## 18. Animation

Animations should communicate state.

Allowed:

- Upload transition
- Loading spinner
- Message appearance
- Button hover
- Expand/collapse

Avoid:

- Large page transitions
- Constant floating animations
- Decorative motion
- Excessive hover effects

## 19. Responsive Design

Desktop:

- Two-column layout can be used where useful.
- Chat gets the majority of available width.

Tablet:

- Reduce spacing.
- Maintain readable content width.

Mobile:

```text
Navbar
↓
Document
↓
Chat
↓
Input
```

The application must remain fully usable without horizontal scrolling.

## 20. Empty State

When no document is uploaded:

```text
StudyMate

Upload your study material to get started.

[ Upload PDF ]
```

Keep it simple.

## 21. Error State

Errors should be understandable.

Bad:

```text
AxiosError: ERR_NETWORK
```

Good:

```text
Unable to connect to StudyMate.
Please check your connection and try again.
```

## 22. Accessibility

Ensure:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Accessible buttons
- Labels for inputs
- Sufficient text contrast
- Meaningful error messages

Do not rely only on color to communicate status.

## 23. Design Anti-Patterns

Do NOT use:

- Glassmorphism
- Purple/blue AI gradients
- Neon effects
- Excessive rounded cards
- Giant hero sections
- Stock AI illustrations
- Floating decorative blobs
- Excessive emoji
- Fake metrics
- Fake testimonials
- Fake user reviews
- Fake AI confidence scores

StudyMate is a functional software product, not a landing-page template.

## 24. Design Goal

The final interface should make the user think:

> "This is a clean tool I can actually use for studying."

It should NOT make the user think:

> "This is an AI template generated for a demo."

Prioritize usability over visual novelty.

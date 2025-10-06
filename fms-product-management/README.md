# FMS Product Management System

A complete franchise management system with home dashboard, product management, and visual layout editor capabilities.

## 📁 Folder Structure

```
fms-product-management/
├── home.html                      # Main dashboard/homepage
├── home-script.js                 # JavaScript for home page
├── home-styles.css                # CSS styles for home page
├── add-product.html               # Product addition page
├── add-product-script.js          # JavaScript for add product page
├── add-product-styles.css         # CSS styles for add product page
├── layout-editor.html             # Visual layout editor (NEW!)
├── layout-editor-script.js        # JavaScript for layout editor
├── layout-editor-styles.css       # CSS styles for layout editor
└── README.md                      # This file
```

## 🔗 Page Navigation

### Home Page (`home.html`)
- **Purpose**: Main dashboard for franchise management
- **Links to**: 
  - Clicking "Add product" button → navigates to `add-product.html`
  - Clicking "Get started" button → navigates to `add-product.html`
  - Clicking "Schedule a Job" button → navigates to `add-product.html`

### Add Product Page (`add-product.html`)
- **Purpose**: Form for adding new products/services
- **Links to**:
  - Clicking back arrow (←) button → navigates to `home.html`

### Layout Editor Page (`layout-editor.html`) ⭐ NEW!
- **Purpose**: Visual layout editor for customizing store appearance (Shopify-style)
- **Features**:
  - **Component Tree**: Hierarchical view of page sections with drag-and-drop reordering
  - **Live Preview**: Real-time preview of store layout with product grid
  - **Settings Panel**: Dynamic settings that change based on selected elements
  - **Component Manipulation**: Add, duplicate, and delete sections/components
  - **Live Element Selection**: Click on preview elements to edit them directly
  - **Responsive Preview Modes**: Desktop, tablet, and mobile view modes
  - **Undo/Redo System**: Full history with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
  - **Typography Controls**: Font size, style, and case customization
  - **Color Scheme Selector**: Dynamic color theming
  - **Image Settings**: Ratio and border radius controls
  - **Mobile Layout Toggles**: Responsive behavior controls

## 🚀 How to Use

1. **Open the application**:
   - Double-click `home.html` to start
   - Or right-click → Open with → Your preferred browser

2. **Navigate between pages**:
   - From Home → Click any "Add product", "Get started", or "Schedule a Job" button
   - From Add Product → Click the back arrow (←) in the header

3. **Features on Home Page**:
   - View dashboard overview
   - Quick actions for common tasks
   - Today's appointments
   - Service setup tasks
   - Payment and domain management

4. **Features on Add Product Page**:
   - Add product title and type
   - Rich text description editor
   - Media upload (images, videos)
   - Category selection
   - Pricing information
   - Inventory management
   - Product tags
   - Active/Inactive status toggle

## 🎨 Styling

- **Design System**: Modern, clean interface with Inter font family
- **Color Scheme**: Professional blue and green accents
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Icons**: Font Awesome 6.4.0

## 🎨 Layout Editor Features

### Component Management
- **Drag & Drop**: Click and drag components in the left sidebar to reorder them
- **Add Components**: Click "Add section" buttons to add new components (Hero, Text, Products, etc.)
- **Duplicate Components**: Hover over components and click the copy icon to duplicate
- **Delete Components**: Click the trash icon to remove components (with confirmation)

### Live Editing
- **Element Selection**: Click on any element in the preview area to select and edit it
- **Dynamic Settings**: Settings panel updates based on selected element
- **Real-time Preview**: Changes appear instantly in the preview

### Responsive Design
- **Preview Modes**: Switch between Desktop, Tablet, and Mobile views using header buttons
- **Responsive Scaling**: Preview automatically scales to show different screen sizes
- **Mobile Settings**: Configure mobile-specific layout options

### History & Undo
- **Undo/Redo**: Use Ctrl+Z/Ctrl+Y or header buttons to undo/redo changes
- **History Tracking**: Full history of layout changes with timestamps
- **State Management**: Automatic saving of layout states

### Advanced Controls
- **Typography**: Adjust font sizes, styles, and text case
- **Colors**: Change text and background colors with color pickers
- **Spacing**: Control margins, padding, and layout spacing
- **Images**: Set image ratios and border radius
- **Layout Options**: Configure grid layouts and component arrangements

## 🔧 Technical Details

- **HTML5** semantic markup
- **CSS3** with custom properties (CSS variables)
- **Vanilla JavaScript** (no frameworks required)
- **Local Storage** for saving user preferences
- **Responsive Design** with media queries
- **Accessibility** features included

## 📝 Customization

### To change colors:
Edit CSS variables in `home-styles.css` or `add-product-styles.css`:
```css
:root {
    --primary-color: #3b82f6;      /* Change primary color */
    --secondary-color: #10b981;     /* Change secondary color */
    --background-light: #f9fafb;    /* Change background */
}
```

### To add more navigation items:
Edit the sidebar navigation in `home.html`:
```html
<div class="nav-item">
    <i class="fas fa-your-icon"></i>
    <span>Your Menu Item</span>
</div>
```

## 🌐 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📦 Dependencies

All dependencies are loaded via CDN:
- **Google Fonts** (Inter font family)
- **Font Awesome** 6.4.0 (icons)

No local installation required!

## 🐛 Known Issues

None currently. Report issues if you find any.

## 📄 License

This project is part of the Franchise Management System.

## 👥 Support

For questions or support, please contact the development team.

---

**Last Updated**: October 3, 2025  
**Version**: 1.0.0

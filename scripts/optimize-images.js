const imagemin = require('imagemin').default;
const imageminWebp = require('imagemin-webp').default;
const imageminMozjpeg = require('imagemin-mozjpeg').default;
const path = require('path');
const fs = require('fs').promises;

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  
  // Create optimized directory if it doesn't exist
  const optimizedDir = path.join(__dirname, '../src/assets/img/optimized');
  try {
    await fs.mkdir(optimizedDir, { recursive: true });
  } catch (err) {
    console.error('Error creating directory:', err);
  }

  // Optimize JPEG images to WebP
  try {
    const webpFiles = await imagemin(['src/assets/img/*.{jpg,jpeg,png}'], {
      destination: 'src/assets/img/optimized',
      plugins: [
        imageminWebp({ 
          quality: 85,
          method: 6 // Slowest but best compression
        })
      ]
    });
    
    console.log('✅ WebP conversion complete:');
    webpFiles.forEach(file => {
      console.log(`   - ${path.basename(file.sourcePath)} → ${path.basename(file.destinationPath)}`);
    });
  } catch (err) {
    console.error('WebP conversion error:', err);
  }

  // Also create optimized JPEG versions as fallbacks
  try {
    const jpegFiles = await imagemin(['src/assets/img/*.{jpg,jpeg}'], {
      destination: 'src/assets/img/optimized',
      plugins: [
        imageminMozjpeg({ 
          quality: 85,
          progressive: true
        })
      ]
    });
    
    console.log('✅ JPEG optimization complete:');
    jpegFiles.forEach(file => {
      console.log(`   - ${path.basename(file.sourcePath)} optimized`);
    });
  } catch (err) {
    console.error('JPEG optimization error:', err);
  }

  // Copy optimized images to docs folder during build
  console.log('\n📋 Next steps:');
  console.log('1. Update Grunt copy task to include optimized images');
  console.log('2. Update Pug templates to use <picture> elements');
  console.log('3. Run "npm run build" to deploy optimized images');
}

// Run the optimization
optimizeImages().catch(console.error);
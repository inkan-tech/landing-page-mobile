const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function optimizeImages() {
  console.log('🖼️  Starting image optimization with Sharp...');
  
  const sourceDir = path.join(__dirname, '../src/assets/img');
  const optimizedDir = path.join(__dirname, '../src/assets/img/optimized');
  
  // Create optimized directory if it doesn't exist
  try {
    await fs.mkdir(optimizedDir, { recursive: true });
    console.log(`📁 Created directory: ${optimizedDir}`);
  } catch (err) {
    console.error('Error creating directory:', err);
    return;
  }

  // Read all image files from source directory
  let files;
  try {
    const allFiles = await fs.readdir(sourceDir);
    files = allFiles.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
    console.log(`📸 Found ${files.length} images to optimize`);
  } catch (err) {
    console.error('Error reading source directory:', err);
    return;
  }

  // Process each image
  const results = {
    webp: [],
    jpeg: [],
    errors: []
  };

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const baseName = path.parse(file).name;
    
    try {
      // Convert to WebP
      const webpPath = path.join(optimizedDir, `${baseName}.webp`);
      await sharp(sourcePath)
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      results.webp.push({ source: file, output: `${baseName}.webp` });

      // Optimize JPEG (if source is JPEG/JPG)
      if (/\.(jpg|jpeg)$/i.test(file)) {
        const jpegPath = path.join(optimizedDir, file);
        await sharp(sourcePath)
          .jpeg({ quality: 85, progressive: true })
          .toFile(jpegPath);
        results.jpeg.push({ source: file, output: file });
      }
      
      // Optimize PNG (if source is PNG)
      if (/\.png$/i.test(file)) {
        const pngPath = path.join(optimizedDir, file);
        await sharp(sourcePath)
          .png({ compressionLevel: 9 })
          .toFile(pngPath);
        results.jpeg.push({ source: file, output: file });
      }

    } catch (err) {
      results.errors.push({ file, error: err.message });
    }
  }

  // Report results
  console.log('\n✅ WebP conversion complete:');
  results.webp.forEach(({ source, output }) => {
    console.log(`   - ${source} → ${output}`);
  });

  console.log('\n✅ Image optimization complete:');
  results.jpeg.forEach(({ source, output }) => {
    console.log(`   - ${source} → ${output} (optimized)`);
  });

  if (results.errors.length > 0) {
    console.log('\n❌ Errors occurred:');
    results.errors.forEach(({ file, error }) => {
      console.log(`   - ${file}: ${error}`);
    });
  }

  // Report file sizes
  console.log('\n📊 Optimization summary:');
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const file of files) {
    try {
      const originalPath = path.join(sourceDir, file);
      const originalStats = await fs.stat(originalPath);
      totalOriginal += originalStats.size;
      
      const baseName = path.parse(file).name;
      const webpPath = path.join(optimizedDir, `${baseName}.webp`);
      const webpStats = await fs.stat(webpPath);
      totalOptimized += webpStats.size;
    } catch (err) {
      // Skip if file doesn't exist
    }
  }
  
  const savings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
  console.log(`   - Original: ${(totalOriginal / 1024).toFixed(1)}KB`);
  console.log(`   - WebP: ${(totalOptimized / 1024).toFixed(1)}KB`);
  console.log(`   - Savings: ${savings}%`);

  // Next steps
  console.log('\n📋 Next steps:');
  console.log('1. Grunt copy task will include optimized images in build');
  console.log('2. Consider updating templates to use <picture> elements');
  console.log('3. Run "npm run build" to deploy optimized images');
}

// Run the optimization
optimizeImages().catch(console.error);
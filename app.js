// Memorial Image Generator
class MemorialGenerator {
    constructor() {
        this.canvas = document.getElementById('memorialCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Form elements
        this.firstNameInput = document.getElementById('firstName');
        this.lastNameInput = document.getElementById('lastName');
        this.birthDateInput = document.getElementById('birthDate');
        this.deathDateInput = document.getElementById('deathDate');
        this.photoUpload = document.getElementById('photoUpload');
        this.removePhotoBtn = document.getElementById('removePhoto');
        this.videoBtn = document.getElementById('videoBtn');
        this.fileNameSpan = document.getElementById('fileName');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        this.uploadedPhoto = null;
        this.uploadedBranch = null;
        this.generatedVideoBlob = null;
        this.generatedFilename = null;
        
        // Home Assistant config - empty for same-origin (hosted on HA)
        this.haUrl = '';
        this.haToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4NjJhODYzYWI5NmE0Yjc5ODI5OGFkZTdmZjdiNTYwMyIsImlhdCI6MTc2NzY0NDczMiwiZXhwIjoyMDgzMDA0NzMyfQ.LF_4pQzvLDwfefa0Tc38Mjci_khSwWS_xJLIrcoZ-XU';
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.firstNameInput.addEventListener('input', () => this.render());
        this.lastNameInput.addEventListener('input', () => this.render());
        this.birthDateInput.addEventListener('input', () => this.render());
        this.deathDateInput.addEventListener('input', () => this.render());
        
        this.photoUpload.addEventListener('change', (e) => this.handlePhotoUpload(e));
        this.removePhotoBtn.addEventListener('click', () => this.removePhoto());
        this.videoBtn.addEventListener('click', () => this.generateVideo());
        
        // Send to Home Assistant button
        this.sendBtn = document.getElementById('sendBtn');
        this.sendBtn.addEventListener('click', () => this.sendToHomeAssistant());
        
        // Load default branch image
        this.loadDefaultBranch();
    }
    
    loadDefaultBranch() {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Required for VideoFrame creation
        img.onload = () => {
            this.uploadedBranch = img;
            this.render();
        };
        img.src = 'galazka/galazkaa.png';
    }
    
    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.crossOrigin = 'anonymous'; // Required for VideoFrame creation
                img.onload = () => {
                    this.uploadedPhoto = img;
                    this.render();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            this.fileNameSpan.textContent = file.name;
            this.removePhotoBtn.style.display = 'block';
        }
    }
    
    removePhoto() {
        this.uploadedPhoto = null;
        this.photoUpload.value = '';
        this.fileNameSpan.textContent = 'Nie wybrano pliku';
        this.removePhotoBtn.style.display = 'none';
        this.render();
    }
    
    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Get form values
        const firstName = this.firstNameInput.value || '';
        const lastName = this.lastNameInput.value || '';
        const birthDate = this.birthDateInput.value || '';
        const deathDate = this.deathDateInput.value || '';
        
        // Calculate positions based on photo presence
        const hasPhoto = this.uploadedPhoto !== null;
        const textX = hasPhoto ? 120 : 200;
        
        // Draw name with small caps style
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        
        // First name - larger first letter
        if (firstName) {
            const firstLetter = firstName.charAt(0).toUpperCase();
            const restName = firstName.slice(1).toUpperCase();
            
            ctx.font = '500 62px "Cormorant Garamond", Georgia, serif';
            const firstLetterWidth = ctx.measureText(firstLetter).width;
            ctx.fillText(firstLetter, textX, 240);
            
            ctx.font = '500 48px "Cormorant Garamond", Georgia, serif';
            ctx.fillText(restName, textX + firstLetterWidth, 240);
        }
        
        // Last name - larger first letter
        if (lastName) {
            const firstLetter = lastName.charAt(0).toUpperCase();
            const restName = lastName.slice(1).toUpperCase();
            
            ctx.font = '500 62px "Cormorant Garamond", Georgia, serif';
            const firstLetterWidth = ctx.measureText(firstLetter).width;
            ctx.fillText(firstLetter, textX, 320);
            
            ctx.font = '500 48px "Cormorant Garamond", Georgia, serif';
            ctx.fillText(restName, textX + firstLetterWidth, 320);
        }
        
        // Draw small decorative branch below name (if uploaded)
        if (this.uploadedBranch) {
            this.drawSmallBranch(ctx, textX + 80, 400);
        }
        
        // Draw dates
        ctx.font = 'italic 48px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = '#ffffff';
        
        if (birthDate) {
            ctx.fillText(birthDate, textX, 500);
        }
        if (deathDate) {
            ctx.fillText(deathDate, textX, 570);
        }
        
        // Draw large decorative branch on right (if uploaded)
        if (this.uploadedBranch) {
            this.drawLargeBranch(ctx, width - 350, height / 2);
        }
        
        // Draw photo if uploaded
        if (this.uploadedPhoto) {
            this.drawPhoto(ctx, width - 450, 100, 350, 500);
        }
    }
    
    drawSmallBranch(ctx, x, y) {
        if (!this.uploadedBranch) return;
        
        const img = this.uploadedBranch;
        const maxWidth = 120;
        const maxHeight = 60;
        
        let width = img.width;
        let height = img.height;
        
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
    
    drawLargeBranch(ctx, x, y) {
        if (!this.uploadedBranch) return;
        
        const img = this.uploadedBranch;
        const maxWidth = 400;
        const maxHeight = 500;
        
        let width = img.width;
        let height = img.height;
        
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
    
    drawPhoto(ctx, x, y, maxWidth, maxHeight) {
        const img = this.uploadedPhoto;
        
        // Calculate dimensions to fit while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
        
        // Center the image in the available space
        const offsetX = x + (maxWidth - width) / 2;
        const offsetY = y + (maxHeight - height) / 2;
        
        // Draw subtle frame
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX - 5, offsetY - 5, width + 10, height + 10);
        
        // Draw image
        ctx.drawImage(img, offsetX, offsetY, width, height);
        
        // Add subtle vignette effect
        const gradient = ctx.createRadialGradient(
            offsetX + width / 2, offsetY + height / 2, Math.min(width, height) * 0.3,
            offsetX + width / 2, offsetY + height / 2, Math.max(width, height) * 0.7
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(offsetX, offsetY, width, height);
    }
    
    async generateVideo() {
        const firstName = this.firstNameInput.value || 'memorial';
        const lastName = this.lastNameInput.value || '';
        const filename = `${firstName}_${lastName}_pamiatka.mp4`.replace(/\s+/g, '_');
        
        // Show progress
        this.progressContainer.style.display = 'block';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = 'Przygotowywanie...';
        this.videoBtn.disabled = true;
        
        try {
            // Check if VideoEncoder is supported
            if (typeof VideoEncoder === 'undefined') {
                throw new Error('Twoja przeglądarka nie obsługuje WebCodecs API. Użyj Chrome lub Edge.');
            }
            
            // Check if mobile device
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Use smaller dimensions for better codec compatibility
            // Make dimensions divisible by 16 for H.264
            const width = 1280;
            const height = 720;
            const fps = isMobile ? 5 : 10; // Lower FPS on mobile
            const duration = isMobile ? 30 : 180; // 30 sec on mobile, 3 min on desktop
            const totalFrames = fps * duration;
            
            // Create offscreen canvas for rendering at target resolution
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = width;
            offscreenCanvas.height = height;
            const offscreenCtx = offscreenCanvas.getContext('2d');
            
            // Calculate bitrate to stay under 9.5MB for 3 minutes
            // 9.5 MB = 76 Mbit, 76/180 ≈ 0.42 Mbps, using 400 kbps for safety
            const bitrate = 400_000; // 400 kbps
            
            // Check codec support
            const codecConfig = {
                codec: 'avc1.42001f', // H.264 Baseline Level 3.1
                width: width,
                height: height,
                bitrate: bitrate,
                framerate: fps,
                avc: { format: 'avc' }
            };
            
            const support = await VideoEncoder.isConfigSupported(codecConfig);
            if (!support.supported) {
                throw new Error('Kodek H.264 nie jest obsługiwany przez tę przeglądarkę');
            }
            
            // Create MP4 muxer
            let muxer = new Mp4Muxer.Muxer({
                target: new Mp4Muxer.ArrayBufferTarget(),
                video: {
                    codec: 'avc',
                    width: width,
                    height: height
                },
                fastStart: 'in-memory'
            });
            
            // Create video encoder
            let encoderError = null;
            const encoder = new VideoEncoder({
                output: (chunk, meta) => {
                    muxer.addVideoChunk(chunk, meta);
                },
                error: (e) => {
                    console.error('Encoder error:', e);
                    encoderError = e;
                }
            });
            
            encoder.configure(support.config);
            
            // Generate frames
            for (let i = 0; i < totalFrames; i++) {
                if (encoderError) throw encoderError;
                
                const progress = i / totalFrames;
                
                // Update progress bar
                this.progressFill.style.width = `${progress * 90}%`;
                this.progressText.textContent = `Generowanie klatki ${i + 1}/${totalFrames}...`;
                
                // Render animated frame to main canvas
                this.renderAnimated(progress);
                
                // Copy to offscreen canvas at target resolution
                offscreenCtx.drawImage(this.canvas, 0, 0, width, height);
                
                // Create VideoFrame from offscreen canvas
                const frame = new VideoFrame(offscreenCanvas, {
                    timestamp: (i * 1000000) / fps, // microseconds
                    duration: 1000000 / fps
                });
                
                // Encode frame (keyframe every second)
                encoder.encode(frame, { keyFrame: i % fps === 0 });
                frame.close();
                
                // Yield to UI every few frames
                if (i % 10 === 0) {
                    await new Promise(r => setTimeout(r, 1));
                }
            }
            
            // Wait for encoder to finish
            await encoder.flush();
            encoder.close();
            
            // Finalize MP4
            muxer.finalize();
            
            // Render final frame to main canvas
            this.render();
            
            // Get the MP4 data
            const mp4Data = muxer.target.buffer;
            const mp4Blob = new Blob([mp4Data], { type: 'video/mp4' });
            
            // Check file size
            const maxSize = 9.5 * 1024 * 1024;
            const fileSizeMB = mp4Blob.size / (1024 * 1024);
            
            this.progressFill.style.width = '100%';
            this.progressText.textContent = `Rozmiar: ${fileSizeMB.toFixed(2)} MB`;
            
            if (mp4Blob.size > maxSize) {
                this.progressText.textContent = `Plik: ${fileSizeMB.toFixed(2)} MB (przekracza limit 9.5 MB)`;
            }
            
            // Save blob for sending
            this.generatedVideoBlob = mp4Blob;
            this.generatedFilename = `${lastName || firstName || 'video'}.mp4`.toLowerCase().replace(/\s+/g, '_');
            
            // Enable send button
            this.sendBtn.disabled = false;
            
            if (isMobile) {
                // On mobile - don't download, just show success and prompt to send
                this.progressText.textContent = 'Gotowe! Kliknij "Wyślij do prosektorium"';
                setTimeout(() => {
                    this.progressContainer.style.display = 'none';
                    this.videoBtn.disabled = false;
                }, 3000);
            } else {
                // On desktop - download file
            const url = URL.createObjectURL(mp4Blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
            
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
                this.videoBtn.disabled = false;
            }, 2000);
            }
            
        } catch (error) {
            console.error('Error generating video:', error);
            this.progressText.textContent = 'Błąd: ' + (error.message || error);
            
            // Restore main canvas
            this.render();
            
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
                this.videoBtn.disabled = false;
            }, 3000);
        }
    }
    
    renderAnimated(progress) {
        // Content visible from first to last frame (no black frames)
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Get form values
        const firstName = this.firstNameInput.value || '';
        const lastName = this.lastNameInput.value || '';
        const birthDate = this.birthDateInput.value || '';
        const deathDate = this.deathDateInput.value || '';
        
        // Calculate positions based on photo presence
        const hasPhoto = this.uploadedPhoto !== null;
        const textX = hasPhoto ? 120 : 200;
        
        // All elements visible at full opacity (no animation)
        const opacity = 1;
        
        // Draw name with small caps style
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.textAlign = 'left';
        
        // First name - larger first letter
        if (firstName) {
            const firstLetter = firstName.charAt(0).toUpperCase();
            const restName = firstName.slice(1).toUpperCase();
            
            ctx.font = '500 62px "Cormorant Garamond", Georgia, serif';
            const firstLetterWidth = ctx.measureText(firstLetter).width;
            ctx.fillText(firstLetter, textX, 240);
            
            ctx.font = '500 48px "Cormorant Garamond", Georgia, serif';
            ctx.fillText(restName, textX + firstLetterWidth, 240);
        }
        
        // Last name - larger first letter
        if (lastName) {
            const firstLetter = lastName.charAt(0).toUpperCase();
            const restName = lastName.slice(1).toUpperCase();
            
            ctx.font = '500 62px "Cormorant Garamond", Georgia, serif';
            const firstLetterWidth = ctx.measureText(firstLetter).width;
            ctx.fillText(firstLetter, textX, 320);
            
            ctx.font = '500 48px "Cormorant Garamond", Georgia, serif';
            ctx.fillText(restName, textX + firstLetterWidth, 320);
        }
        
        // Draw small decorative branch below name (if uploaded)
        if (this.uploadedBranch) {
            this.drawSmallBranch(ctx, textX + 80, 400);
        }
        
        // Draw dates
        ctx.font = 'italic 48px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        if (birthDate) {
            ctx.fillText(birthDate, textX, 500);
        }
        if (deathDate) {
            ctx.fillText(deathDate, textX, 570);
        }
        
        // Draw large decorative branch on right (if uploaded)
        if (this.uploadedBranch) {
            this.drawLargeBranch(ctx, width - 350, height / 2);
        }
        
        // Draw photo if uploaded
        if (this.uploadedPhoto) {
            this.drawPhoto(ctx, width - 450, 100, 350, 500);
        }
    }
    
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    async sendToHomeAssistant() {
        if (!this.generatedVideoBlob) {
            alert('Najpierw wygeneruj wideo!');
            return;
        }
        
        this.sendBtn.disabled = true;
        this.sendBtn.textContent = 'Wysyłanie...';
        
        try {
            console.log('Rozpoczynam wysyłanie, rozmiar:', this.generatedVideoBlob.size, 'bytes');
            console.log('Nazwa pliku:', this.generatedFilename);
            
            // Convert blob to base64
            const arrayBuffer = await this.generatedVideoBlob.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            
            // Convert to base64 in chunks to avoid stack overflow
            let base64 = '';
            const chunkSize = 32768;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                const chunk = bytes.slice(i, i + chunkSize);
                base64 += String.fromCharCode.apply(null, chunk);
            }
            base64 = btoa(base64);
            
            console.log('Base64 length:', base64.length);
            
            // Send event to Home Assistant
            const response = await fetch(`${this.haUrl}/api/events/upload_video`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.haToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: this.generatedFilename,
                    data: base64
                })
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text}`);
            }
            
            // Success
            this.sendBtn.textContent = 'Wysłano!';
            console.log('Wysłano pomyślnie!');
            setTimeout(() => {
                this.sendBtn.textContent = 'Wyślij do prosektorium';
                this.sendBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Błąd wysyłania:', error);
            alert('Błąd wysyłania: ' + error.message);
            this.sendBtn.textContent = 'Błąd!';
            setTimeout(() => {
                this.sendBtn.textContent = 'Wyślij do prosektorium';
                this.sendBtn.disabled = false;
            }, 3000);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MemorialGenerator();
    new ControlPanel();
});

// Control Panel for Home Assistant
class ControlPanel {
    constructor() {
        this.haUrl = ''; // empty for same-origin (hosted on HA)
        this.haToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4NjJhODYzYWI5NmE0Yjc5ODI5OGFkZTdmZjdiNTYwMyIsImlhdCI6MTc2NzY0NDczMiwiZXhwIjoyMDgzMDA0NzMyfQ.LF_4pQzvLDwfefa0Tc38Mjci_khSwWS_xJLIrcoZ-XU';
        
        this.init();
    }
    
    init() {
        // Video controls
        document.getElementById('videoOn')?.addEventListener('click', () => this.controlSwitch('switch.video', 'turn_on'));
        document.getElementById('videoOff')?.addEventListener('click', () => this.controlSwitch('switch.video', 'turn_off'));
        
        // Music controls
        document.getElementById('musicOn')?.addEventListener('click', () => this.controlSwitch('switch.muzyka', 'turn_on'));
        document.getElementById('musicOff')?.addEventListener('click', () => this.controlSwitch('switch.muzyka', 'turn_off'));
        
        // Volume buttons
        document.querySelectorAll('.volume-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const volume = btn.dataset.volume;
                this.setVolume(volume);
                // Update active state
                document.querySelectorAll('.volume-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Track control
        document.getElementById('setTrack')?.addEventListener('click', () => {
            const trackNum = document.getElementById('trackNumber').value;
            this.setTrack(trackNum);
        });
        
        // Schedule
        document.getElementById('saveScheduleOn')?.addEventListener('click', () => this.saveScheduleOn());
        document.getElementById('saveScheduleOff')?.addEventListener('click', () => this.saveScheduleOff());
        document.getElementById('disableSchedule')?.addEventListener('click', () => this.disableSchedule());
        
        // Refresh status
        this.refreshStatus();
        setInterval(() => this.refreshStatus(), 30000);
    }
    
    
    async callService(domain, service, data = {}) {
        try {
            const response = await fetch(`${this.haUrl}/api/services/${domain}/${service}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.haToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response.ok;
        } catch (error) {
            console.error('HA Service Error:', error);
            return false;
        }
    }
    
    async controlSwitch(entityId, action) {
        const success = await this.callService('switch', action, { entity_id: entityId });
        if (success) {
            setTimeout(() => this.refreshStatus(), 500);
        }
    }
    
    async setVolume(value) {
        await this.callService('input_number', 'set_value', {
            entity_id: 'input_number.volume',
            value: parseInt(value)
        });
    }
    
    async setTrack(trackNum) {
        await this.callService('input_number', 'set_value', {
            entity_id: 'input_number.utwor',
            value: parseInt(trackNum)
        });
    }
    
    async saveScheduleOn() {
        const onTime = document.getElementById('scheduleOn').value;
        
        await this.callService('input_datetime', 'set_datetime', {
            entity_id: 'input_datetime.schedule_on',
            time: onTime
        });
        
        const scheduleInfo = document.getElementById('scheduleInfo');
        if (scheduleInfo) {
            scheduleInfo.textContent = `Projektor włączy się o ${onTime}`;
            scheduleInfo.classList.add('visible');
            scheduleInfo.style.borderColor = 'var(--accent)';
            scheduleInfo.style.color = 'var(--accent)';
        }
    }
    
    async saveScheduleOff() {
        const offTime = document.getElementById('scheduleOff').value;
        
        await this.callService('input_datetime', 'set_datetime', {
            entity_id: 'input_datetime.schedule_off',
            time: offTime
        });
        
        const scheduleInfo = document.getElementById('scheduleInfo');
        if (scheduleInfo) {
            scheduleInfo.textContent = `Projektor wyłączy się o ${offTime}`;
            scheduleInfo.classList.add('visible');
            scheduleInfo.style.borderColor = 'var(--accent)';
            scheduleInfo.style.color = 'var(--accent)';
        }
    }
    
    async disableSchedule() {
        // Disable schedule by setting times to 00:00
        await this.callService('input_datetime', 'set_datetime', {
            entity_id: 'input_datetime.schedule_on',
            time: '00:00:00'
        });
        await this.callService('input_datetime', 'set_datetime', {
            entity_id: 'input_datetime.schedule_off',
            time: '00:00:00'
        });
        
        // Show disabled info
        const scheduleInfo = document.getElementById('scheduleInfo');
        if (scheduleInfo) {
            scheduleInfo.textContent = 'Harmonogram wyłączony';
            scheduleInfo.classList.add('visible');
            scheduleInfo.style.borderColor = '#c94a4a';
            scheduleInfo.style.color = '#c94a4a';
        }
    }
    
    async refreshStatus() {
        try {
            // Get video switch state
            const videoResponse = await fetch(`${this.haUrl}/api/states/switch.video`, {
                headers: { 'Authorization': `Bearer ${this.haToken}` }
            });
            if (videoResponse.ok) {
                const videoData = await videoResponse.json();
                const videoStatus = document.getElementById('videoStatus');
                if (videoStatus) {
                    videoStatus.textContent = videoData.state === 'on' ? 'WŁĄCZONE' : 'WYŁĄCZONE';
                    videoStatus.style.color = videoData.state === 'on' ? '#4a9c6b' : '#c94a4a';
                }
            }
            
            // Get music switch state
            const musicResponse = await fetch(`${this.haUrl}/api/states/switch.muzyka`, {
                headers: { 'Authorization': `Bearer ${this.haToken}` }
            });
            if (musicResponse.ok) {
                const musicData = await musicResponse.json();
                const musicStatus = document.getElementById('musicStatus');
                if (musicStatus) {
                    musicStatus.textContent = musicData.state === 'on' ? 'WŁĄCZONE' : 'WYŁĄCZONE';
                    musicStatus.style.color = musicData.state === 'on' ? '#4a9c6b' : '#c94a4a';
                }
            }
            
            // Get currently playing video from media_player.xsk
            const playerResponse = await fetch(`${this.haUrl}/api/states/media_player.xsk`, {
                headers: { 'Authorization': `Bearer ${this.haToken}` }
            });
            if (playerResponse.ok) {
                const playerData = await playerResponse.json();
                const currentVideo = document.getElementById('currentVideo');
                const liveIndicator = document.getElementById('liveIndicator');
                const mediaId = playerData.attributes?.media_content_id || '';
                
                // Extract filename from URL
                let filename = '--';
                if (mediaId) {
                    const match = mediaId.match(/\/multimedia\/([^?]+)/);
                    if (match) {
                        filename = decodeURIComponent(match[1]);
                    }
                }
                
                if (currentVideo) {
                    currentVideo.textContent = filename;
                }
                
                // Show LIVE indicator if current video matches generated video
                if (liveIndicator && this.generatedFilename) {
                    if (filename === this.generatedFilename) {
                        liveIndicator.classList.add('visible');
                    } else {
                        liveIndicator.classList.remove('visible');
                    }
                }
            }
            
            // Get current track number
            const trackResponse = await fetch(`${this.haUrl}/api/states/input_number.utwor`, {
                headers: { 'Authorization': `Bearer ${this.haToken}` }
            });
            if (trackResponse.ok) {
                const trackData = await trackResponse.json();
                const currentTrack = document.getElementById('currentTrack');
                if (currentTrack) {
                    const trackNum = Math.round(parseFloat(trackData.state));
                    currentTrack.textContent = trackNum > 0 ? `Utwór ${trackNum}` : '--';
                }
            }
        } catch (error) {
            console.error('Refresh status error:', error);
        }
    }
}

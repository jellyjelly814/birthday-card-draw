// 卡牌数据定义
const cards = [
    {
        id: 1,
        emoji: "😊",
        title: "我的表情包",
        description: "你抽到了我珍藏的表情包！我会发给你一个超级可爱的表情包～",
        color: "#ff9a9e"
    },
    {
        id: 2,
        emoji: "📸",
        title: "美照一张",
        description: "恭喜你！我会发给你一张我最满意的美照，记得夸夸我哦～",
        color: "#a8edea"
    },
    {
        id: 3,
        emoji: "☕",
        title: "请我喝奶茶",
        description: "太棒了！你获得了请我喝奶茶的机会，我等你的奶茶外卖哦～",
        color: "#d299c2"
    },
    {
        id: 4,
        emoji: "💐",
        title: "送我一束花",
        description: "哇！你要送我花花！我喜欢向日葵、玫瑰、满天星，任选一种～",
        color: "#ffd3a5"
    },
    {
        id: 5,
        emoji: "🎵",
        title: "给我唱首歌",
        description: "好浪漫！你要为我唱歌，可以是生日歌，也可以是你喜欢的任何歌曲～",
        color: "#a8c8ec"
    },
    {
        id: 6,
        emoji: "✍️",
        title: "给我写一段话",
        description: "你抽到了写话卡！给我写一段温暖的话，可以是祝福、回忆或者心里话～",
        color: "#ffd1ff"
    },
    {
        id: 7,
        emoji: "🎨",
        title: "给我发一幅画",
        description: "艺术家诞生！你要为我创作一幅画，可以是手绘、数字画或者简笔画～",
        color: "#84fab0"
    },
    {
        id: 8,
        emoji: "🧧",
        title: "给我发个红包",
        description: "哈哈哈！你抽到了红包卡，金额随意，心意最重要～生日快乐红包来一个！",
        color: "#ff9a9e"
    }
];

// 全局变量
let currentCard = null;
let isDrawing = false;
let audioContext = null;
let isPlaying = false;
let musicInterval = null;
let drawCount = 0;
const MAX_DRAWS = 3;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initDrawCount();
    updateDrawCountDisplay();
    
    // 首次访问提示
    if (drawCount === 0) {
        setTimeout(() => {
            showToast('🎴 欢迎来到Jelly的生日抽卡罐！每人限制抽卡3次哦～');
        }, 1500);
    }
    
    console.log('生日抽卡页面已加载完成！');
});

// 初始化抽卡次数
function initDrawCount() {
    const savedCount = localStorage.getItem('jellybirthdayDrawCount');
    if (savedCount) {
        drawCount = parseInt(savedCount, 10);
    }
    
    // 检查是否已达到限制
    if (drawCount >= MAX_DRAWS) {
        disableDrawing();
    }
}

// 保存抽卡次数
function saveDrawCount() {
    localStorage.setItem('jellybirthdayDrawCount', drawCount.toString());
}

// 更新抽卡次数显示
function updateDrawCountDisplay() {
    const remainingDraws = MAX_DRAWS - drawCount;
    const drawButton = document.getElementById('draw-button');
    
    if (drawCount === 0) {
        // 首次抽卡
        drawButton.innerHTML = '<span class="button-text">🎴 开始抽卡 🎴</span>';
    } else if (remainingDraws > 0) {
        // 还有剩余次数
        drawButton.innerHTML = `<span class="button-text">🎴 再抽一张 (还剩${remainingDraws}次) 🎴</span>`;
    } else {
        // 已达到限制
        drawButton.innerHTML = '<span class="button-text">🎴 今日抽卡已用完 🎴</span>';
    }
}

// 禁用抽卡功能
function disableDrawing() {
    const drawButton = document.getElementById('draw-button');
    const redrawButton = document.getElementById('redraw-button');
    
    drawButton.disabled = true;
    drawButton.classList.add('disabled');
    
    if (redrawButton) {
        redrawButton.style.display = 'none';
    }
    
    updateDrawCountDisplay();
}

// 抽卡主函数
function drawCard() {
    if (isDrawing) return;
    
    // 检查抽卡次数限制
    if (drawCount >= MAX_DRAWS) {
        showToast('🎴 你已经抽了3张卡牌了，每人限制3次哦～');
        return;
    }
    
    isDrawing = true;
    const drawButton = document.getElementById('draw-button');
    const card = document.getElementById('card');
    const resultSection = document.getElementById('result-section');
    
    // 增加抽卡次数
    drawCount++;
    saveDrawCount();
    
    // 禁用按钮
    drawButton.disabled = true;
    drawButton.innerHTML = '<span class="button-text">🎴 抽取中... 🎴</span>';
    
    // 隐藏之前的结果
    resultSection.classList.remove('show');
    
    // 随机选择一张卡牌
    const randomIndex = Math.floor(Math.random() * cards.length);
    currentCard = cards[randomIndex];
    
    // 添加抽卡音效（如果需要的话）
    playDrawSound();
    
    // 卡牌翻转动画
    setTimeout(() => {
        card.classList.add('flipped');
        updateCardContent();
    }, 500);
    
    // 显示结果
    setTimeout(() => {
        showResult();
        createCelebrationEffect();
        
        // 检查是否达到限制
        if (drawCount >= MAX_DRAWS) {
            disableDrawing();
            showToast('🎴 你已经用完了所有3次抽卡机会，感谢参与！');
        } else {
            drawButton.disabled = false;
            updateDrawCountDisplay();
        }
        
        isDrawing = false;
    }, 1300);
}

// 更新卡牌内容
function updateCardContent() {
    const cardContent = document.getElementById('card-content');
    if (currentCard) {
        cardContent.innerHTML = `
            <div style="background: ${currentCard.color}; padding: 20px; border-radius: 15px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
                <span style="font-size: 3rem; margin-bottom: 10px;">${currentCard.emoji}</span>
                <h3 style="font-size: 1.2rem; margin-bottom: 8px; color: #fff;">${currentCard.title}</h3>
            </div>
        `;
    }
}

// 显示抽卡结果
function showResult() {
    if (!currentCard) return;
    
    const resultCard = document.getElementById('result-card');
    const resultSection = document.getElementById('result-section');
    const remainingDraws = MAX_DRAWS - drawCount;
    
    let remainingText = '';
    if (remainingDraws > 0) {
        remainingText = `<p class="remaining-draws">🎴 你还可以再抽 ${remainingDraws} 张卡牌</p>`;
    } else {
        remainingText = '<p class="remaining-draws">🎴 你已经用完了所有抽卡机会</p>';
    }
    
    resultCard.innerHTML = `
        <span class="card-emoji">${currentCard.emoji}</span>
        <h2 class="card-title">${currentCard.title}</h2>
        <p class="card-description">${currentCard.description}</p>
        ${remainingText}
    `;
    
    resultSection.classList.add('show');
}

// 重置卡牌
function resetCard() {
    // 检查是否还有剩余次数
    if (drawCount >= MAX_DRAWS) {
        showToast('🎴 你已经用完了所有3次抽卡机会哦～');
        return;
    }
    
    const card = document.getElementById('card');
    const resultSection = document.getElementById('result-section');
    
    // 隐藏结果
    resultSection.classList.remove('show');
    
    // 重置卡牌
    setTimeout(() => {
        card.classList.remove('flipped');
        currentCard = null;
    }, 300);
}

// 显示分享选项
function showShareOptions() {
    const shareOptions = document.getElementById('share-options');
    const shareMethods = document.getElementById('share-methods');
    
    shareOptions.style.display = 'none';
    shareMethods.style.display = 'flex';
}

// 隐藏分享选项
function hideShareOptions() {
    const shareOptions = document.getElementById('share-options');
    const shareMethods = document.getElementById('share-methods');
    
    shareOptions.style.display = 'block';
    shareMethods.style.display = 'none';
}

// 分享文字结果
function shareText() {
    if (!currentCard) return;
    
    const shareText = `🎉 我在Jelly的生日抽卡中抽到了"${currentCard.title}"！${currentCard.description} 祝生日快乐！🎂`;
    
    // 检查是否支持 Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Jelly的生日抽卡结果',
            text: shareText,
            url: window.location.href
        }).then(() => {
            console.log('分享成功');
            hideShareOptions();
        }).catch((error) => {
            console.log('分享失败', error);
            fallbackShare(shareText);
            hideShareOptions();
        });
    } else {
        fallbackShare(shareText);
        hideShareOptions();
    }
}

// 保存卡牌图片
function saveCardImage() {
    if (!currentCard) return;
    
    // 创建canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    canvas.width = 600;
    canvas.height = 400;
    
    // 绘制背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, currentCard.color);
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制边框
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // 绘制emoji
    ctx.font = '120px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText(currentCard.emoji, canvas.width / 2, 150);
    
    // 绘制标题
    ctx.font = 'bold 36px "Microsoft YaHei", Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(currentCard.title, canvas.width / 2, 220);
    
    // 绘制描述（多行文字）
    ctx.font = '24px "Microsoft YaHei", Arial';
    ctx.fillStyle = '#666';
    const description = currentCard.description;
    const maxWidth = canvas.width - 80;
    const lineHeight = 35;
    let y = 270;
    
    // 简单的文字换行
    const words = description.split('');
    let line = '';
    let lines = [];
    
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n];
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    
    // 绘制每一行
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, y + (index * lineHeight));
    });
    
    // 添加水印
    ctx.font = '18px Arial';
    ctx.fillStyle = '#999';
    ctx.fillText('🎂 Jelly的生日抽卡罐 🎂', canvas.width / 2, canvas.height - 30);
    
    // 保存图片
    try {
        // 创建下载链接
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Jelly生日卡牌-${currentCard.title}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('🎴 卡牌已保存！快去找Jelly兑奖吧～');
            hideShareOptions();
        }, 'image/png');
    } catch (error) {
        console.error('保存图片失败:', error);
        showToast('保存失败，请重试');
    }
}

// 备用分享方式
function fallbackShare(text) {
    // 复制到剪贴板
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('内容已复制到剪贴板，快去分享吧！');
        });
    } else {
        // 降级处理
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('内容已复制到剪贴板，快去分享吧！');
    }
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 1000;
        animation: fadeInUp 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeInDown 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 播放抽卡音效（简单的音频反馈）
function playDrawSound() {
    // 创建音频上下文（如果浏览器支持）
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('音频播放失败:', e);
        }
    }
}

// 创建庆祝效果
function createCelebrationEffect() {
    const colors = ['#ff9a9e', '#fecfef', '#a8edea', '#d299c2', '#ffd3a5'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 50);
    }
}

// 创建彩带效果
function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        top: -10px;
        left: ${Math.random() * 100}%;
        z-index: 1000;
        border-radius: 50%;
        animation: confettiFall 3s linear forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 3000);
}

// 初始化粒子效果
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    
    for (let i = 0; i < 30; i++) {
        createParticle(particlesContainer);
    }
}

// 创建单个粒子
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置和动画延迟
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
    
    container.appendChild(particle);
    
    // 粒子循环
    particle.addEventListener('animationend', () => {
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = '0s';
    });
}

// 添加CSS动画（通过JavaScript动态添加）
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 触摸设备优化
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, { passive: true });
}

// 页面可见性API优化
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面显示时恢复动画
        document.body.style.animationPlayState = 'running';
    }
});

// ============= 音乐播放功能 =============

// 生日歌音符序列 (简化版《生日快乐歌》)
const birthdaySong = [
    { note: 'C4', duration: 0.5 },
    { note: 'C4', duration: 0.5 },
    { note: 'D4', duration: 1 },
    { note: 'C4', duration: 1 },
    { note: 'F4', duration: 1 },
    { note: 'E4', duration: 2 },
    
    { note: 'C4', duration: 0.5 },
    { note: 'C4', duration: 0.5 },
    { note: 'D4', duration: 1 },
    { note: 'C4', duration: 1 },
    { note: 'G4', duration: 1 },
    { note: 'F4', duration: 2 },
    
    { note: 'C4', duration: 0.5 },
    { note: 'C4', duration: 0.5 },
    { note: 'C5', duration: 1 },
    { note: 'A4', duration: 1 },
    { note: 'F4', duration: 1 },
    { note: 'E4', duration: 1 },
    { note: 'D4', duration: 2 },
    
    { note: 'Bb4', duration: 0.5 },
    { note: 'Bb4', duration: 0.5 },
    { note: 'A4', duration: 1 },
    { note: 'F4', duration: 1 },
    { note: 'G4', duration: 1 },
    { note: 'F4', duration: 2 }
];

// 音符频率映射
const noteFrequencies = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'Bb4': 466.16,
    'C5': 523.25
};

// 初始化音频上下文
function initAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('音频上下文初始化失败:', e);
            return false;
        }
    }
    return true;
}

// 播放单个音符
function playNote(frequency, duration, startTime = 0) {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
    oscillator.type = 'sine';
    
    // 音量包络
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + startTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
    
    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + duration);
}

// 播放生日歌
function playBirthdaySong() {
    if (!initAudioContext()) {
        showToast('抱歉，您的浏览器不支持音频播放');
        return;
    }
    
    let currentTime = 0;
    
    birthdaySong.forEach(({ note, duration }) => {
        const frequency = noteFrequencies[note];
        if (frequency) {
            playNote(frequency, duration, currentTime);
            currentTime += duration;
        }
    });
    
    // 设置音乐结束后的回调
    setTimeout(() => {
        if (isPlaying) {
            // 循环播放
            playBirthdaySong();
        }
    }, currentTime * 1000);
}

// 切换音乐播放
function toggleMusic() {
    const musicButton = document.getElementById('music-button');
    const musicIcon = document.getElementById('music-icon');
    const musicText = document.getElementById('music-text');
    
    if (!isPlaying) {
        // 开始播放
        if (!initAudioContext()) {
            showToast('抱歉，您的浏览器不支持音频播放');
            return;
        }
        
        // 恢复音频上下文（某些浏览器需要用户交互）
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        isPlaying = true;
        musicButton.classList.add('playing');
        musicIcon.textContent = '🎶';
        musicText.textContent = '正在播放';
        
        playBirthdaySong();
        
        // 创建音乐粒子效果
        createMusicParticles();
        
        showToast('🎵 生日快乐歌开始播放～');
        
    } else {
        // 停止播放
        isPlaying = false;
        musicButton.classList.remove('playing');
        musicIcon.textContent = '🎵';
        musicText.textContent = '播放音乐';
        
        // 停止音频上下文
        if (audioContext) {
            audioContext.suspend();
        }
        
        showToast('🎵 音乐已停止');
    }
}

// 创建音乐粒子效果
function createMusicParticles() {
    if (!isPlaying) return;
    
    const musicNotes = ['♪', '♫', '♬', '🎵', '🎶'];
    const note = musicNotes[Math.floor(Math.random() * musicNotes.length)];
    
    const particle = document.createElement('div');
    particle.textContent = note;
    particle.style.cssText = `
        position: fixed;
        top: 60px;
        right: ${Math.random() * 100 + 50}px;
        font-size: ${Math.random() * 10 + 15}px;
        color: rgba(255, 255, 255, 0.8);
        pointer-events: none;
        z-index: 999;
        animation: musicParticleFloat 3s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 3000);
    
    // 继续创建粒子
    if (isPlaying) {
        setTimeout(createMusicParticles, 800 + Math.random() * 400);
    }
}

// 添加音乐粒子动画CSS
const musicParticleStyle = document.createElement('style');
musicParticleStyle.textContent = `
    @keyframes musicParticleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(musicParticleStyle);

// 隐藏重置功能（仅限管理员使用）
// 在浏览器控制台输入 resetAllDrawCounts() 可以重置所有用户的抽卡次数
function resetAllDrawCounts() {
    localStorage.removeItem('jellybirthdayDrawCount');
    drawCount = 0;
    updateDrawCountDisplay();
    
    const drawButton = document.getElementById('draw-button');
    const redrawButton = document.getElementById('redraw-button');
    
    drawButton.disabled = false;
    drawButton.classList.remove('disabled');
    
    if (redrawButton) {
        redrawButton.style.display = 'inline-block';
    }
    
    console.log('🎉 所有抽卡次数已重置！');
    showToast('🎉 抽卡次数已重置，可以重新开始啦！');
}

// 使重置函数全局可用
window.resetAllDrawCounts = resetAllDrawCounts;

console.log('🎉 生日快乐抽卡系统已准备就绪！');
console.log('💡 管理员提示：在控制台输入 resetAllDrawCounts() 可以重置抽卡次数');
console.log('🔧 调试功能：输入 checkCards() 可以查看所有卡牌数据');

// 调试函数：检查卡牌数据
function checkCards() {
    console.log('📋 所有卡牌数据：');
    cards.forEach((card, index) => {
        console.log(`${index + 1}. ${card.emoji} ${card.title} - ${card.description}`);
    });
    return cards;
}

// 使调试函数全局可用
window.checkCards = checkCards;


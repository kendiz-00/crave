/**
 * CRAVE Spin & Win Wheel
 * Premium prize wheel with realistic physics and animations
 */

const CraveSpinWheel = (function() {
    'use strict';

    const config = typeof CraveRewardsConfig !== 'undefined' ? CraveRewardsConfig : null;
    const engine = typeof CraveRewardsEngine !== 'undefined' ? CraveRewardsEngine : null;
    const data = typeof CraveRewardsData !== 'undefined' ? CraveRewardsData : null;
    const notifications = typeof CraveRewardsNotifications !== 'undefined' ? CraveRewardsNotifications : null;

    let wheelContainer = null;
    let wheel = null;
    let isSpinning = false;
    let currentRotation = 0;

    // Initialize the wheel
    function init() {
        if (wheelContainer) return;
        
        createWheelContainer();
        addWheelStyles();
    }

    // Create wheel container
    function createWheelContainer() {
        wheelContainer = document.createElement('div');
        wheelContainer.id = 'crave-spin-wheel-container';
        wheelContainer.className = 'crave-spin-wheel-container';
        document.body.appendChild(wheelContainer);
    }

    // Add wheel styles
    function addWheelStyles() {
        if (document.getElementById('crave-spin-wheel-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'crave-spin-wheel-styles';
        style.textContent = `
            .crave-spin-wheel-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                z-index: 10003;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .crave-spin-wheel-overlay.show {
                opacity: 1;
                pointer-events: auto;
            }

            .crave-spin-wheel-modal {
                position: relative;
                background: rgba(20, 20, 20, 0.95);
                border: 1px solid rgba(212, 163, 115, 0.3);
                border-radius: 24px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 
                    0 25px 50px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                    0 0 100px rgba(212, 163, 115, 0.1);
            }

            .crave-spin-wheel-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                color: #888888;
                font-size: 20px;
                cursor: pointer;
                border-radius: 12px;
                transition: all 0.2s ease;
            }

            .crave-spin-wheel-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }

            .crave-spin-wheel-title {
                font-size: 28px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 8px;
                letter-spacing: 1px;
            }

            .crave-spin-wheel-subtitle {
                font-size: 14px;
                color: #aaaaaa;
                margin-bottom: 32px;
            }

            .crave-spin-wheel-wrapper {
                position: relative;
                width: 320px;
                height: 320px;
                margin: 0 auto 32px;
            }

            .crave-spin-wheel {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                position: relative;
                transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
                box-shadow: 
                    0 0 0 8px rgba(212, 163, 115, 0.3),
                    0 0 0 12px rgba(212, 163, 115, 0.1),
                    0 20px 40px rgba(0, 0, 0, 0.4),
                    inset 0 0 60px rgba(212, 163, 115, 0.1);
            }

            .crave-spin-wheel-segment {
                position: absolute;
                width: 50%;
                height: 50%;
                transform-origin: 100% 100%;
                left: 0;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                clip-path: polygon(0 0, 100% 0, 100% 100%);
            }

            .crave-spin-wheel-segment-content {
                position: absolute;
                transform: rotate(45deg) translate(50%, -50%);
                text-align: center;
                font-size: 12px;
                color: #ffffff;
                font-weight: 600;
                line-height: 1.2;
            }

            .crave-spin-wheel-segment-icon {
                font-size: 24px;
                display: block;
                margin-bottom: 4px;
            }

            .crave-spin-wheel-pointer {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 20px solid transparent;
                border-right: 20px solid transparent;
                border-top: 40px solid #d4a373;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
                z-index: 10;
            }

            .crave-spin-wheel-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #d4a373, #c49a6c);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                box-shadow: 
                    0 4px 12px rgba(0, 0, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.2);
                z-index: 5;
            }

            .crave-spin-wheel-button {
                background: linear-gradient(135deg, #d4a373, #c49a6c);
                color: #ffffff;
                border: none;
                padding: 16px 48px;
                font-size: 18px;
                font-weight: 600;
                border-radius: 50px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 
                    0 8px 24px rgba(212, 163, 115, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.2);
            }

            .crave-spin-wheel-button:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 
                    0 12px 32px rgba(212, 163, 115, 0.4),
                    inset 0 2px 4px rgba(255, 255, 255, 0.2);
            }

            .crave-spin-wheel-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .crave-spin-wheel-spins-left {
                margin-top: 16px;
                font-size: 14px;
                color: #888888;
            }

            .crave-spin-wheel-result {
                display: none;
                margin-top: 24px;
                padding: 20px;
                background: rgba(212, 163, 115, 0.1);
                border: 1px solid rgba(212, 163, 115, 0.3);
                border-radius: 16px;
            }

            .crave-spin-wheel-result.show {
                display: block;
                animation: result-appear 0.5s ease;
            }

            @keyframes result-appear {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .crave-spin-wheel-result-icon {
                font-size: 48px;
                margin-bottom: 12px;
            }

            .crave-spin-wheel-result-title {
                font-size: 20px;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 8px;
            }

            .crave-spin-wheel-result-text {
                font-size: 14px;
                color: #aaaaaa;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .crave-spin-wheel-modal {
                    padding: 24px;
                    max-width: 95%;
                }

                .crave-spin-wheel-wrapper {
                    width: 280px;
                    height: 280px;
                }

                .crave-spin-wheel-title {
                    font-size: 24px;
                }
            }

            /* Reduced Motion */
            @media (prefers-reduced-motion: reduce) {
                .crave-spin-wheel {
                    transition: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Build the wheel
    function buildWheel() {
        if (!config) return;
        
        const prizes = config.spinWheel.prizes;
        const segmentAngle = 360 / prizes.length;
        
        const wheelHTML = `
            <div class="crave-spin-wheel-overlay" id="crave-spin-wheel-overlay">
                <div class="crave-spin-wheel-modal">
                    <button class="crave-spin-wheel-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2 class="crave-spin-wheel-title">Spin & Win</h2>
                    <p class="crave-spin-wheel-subtitle">Try your luck and win amazing prizes!</p>
                    
                    <div class="crave-spin-wheel-wrapper">
                        <div class="crave-spin-wheel-pointer"></div>
                        <div class="crave-spin-wheel" id="crave-spin-wheel">
                            ${prizes.map((prize, index) => {
                                const rotation = index * segmentAngle;
                                const colors = [
                                    'rgba(212, 163, 115, 0.8)',
                                    'rgba(196, 154, 108, 0.8)',
                                    'rgba(184, 137, 94, 0.8)',
                                    'rgba(168, 120, 75, 0.8)'
                                ];
                                const color = colors[index % colors.length];
                                
                                return `
                                    <div class="crave-spin-wheel-segment" style="transform: rotate(${rotation}deg); background: ${color};">
                                        <div class="crave-spin-wheel-segment-content">
                                            <span class="crave-spin-wheel-segment-icon">${prize.icon}</span>
                                            <span>${prize.name}</span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="crave-spin-wheel-center">🎡</div>
                    </div>
                    
                    <button class="crave-spin-wheel-button" id="crave-spin-button">Spin Now!</button>
                    <p class="crave-spin-wheel-spins-left" id="crave-spin-spins-left"></p>
                    
                    <div class="crave-spin-wheel-result" id="crave-spin-result">
                        <div class="crave-spin-wheel-result-icon" id="crave-spin-result-icon"></div>
                        <h3 class="crave-spin-wheel-result-title" id="crave-spin-result-title"></h3>
                        <p class="crave-spin-wheel-result-text" id="crave-spin-result-text"></p>
                    </div>
                </div>
            </div>
        `;
        
        wheelContainer.innerHTML = wheelHTML;
        
        // Add event listeners
        const overlay = document.getElementById('crave-spin-wheel-overlay');
        const closeBtn = overlay.querySelector('.crave-spin-wheel-close');
        const spinBtn = document.getElementById('crave-spin-button');
        
        closeBtn.addEventListener('click', hideWheel);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) hideWheel();
        });
        
        spinBtn.addEventListener('click', spin);
        
        wheel = document.getElementById('crave-spin-wheel');
    }

    // Show the wheel
    function showWheel() {
        if (!wheelContainer) init();
        
        const canSpin = engine ? engine.canSpinWheel() : { canSpin: false, reason: 'System not available' };
        
        if (!canSpin.canSpin) {
            if (notifications) {
                notifications.show({
                    type: 'warning',
                    icon: '🔒',
                    title: 'Wheel Locked',
                    message: canSpin.reason
                });
            }
            return;
        }
        
        if (!wheel || !wheelContainer.querySelector('.crave-spin-wheel-overlay')) {
            buildWheel();
        }
        
        const overlay = document.getElementById('crave-spin-wheel-overlay');
        const spinBtn = document.getElementById('crave-spin-button');
        const spinsLeft = document.getElementById('crave-spin-spins-left');
        const result = document.getElementById('crave-spin-result');
        
        result.classList.remove('show');
        spinBtn.disabled = false;
        
        if (data) {
            const spinsToday = data.SpinWheel.getSpinsToday();
            const maxSpins = config ? config.spinWheel.maxSpinsPerDay : 3;
            spinsLeft.textContent = `${maxSpins - spinsToday} spins remaining today`;
        }
        
        overlay.classList.add('show');
    }

    // Hide the wheel
    function hideWheel() {
        const overlay = document.getElementById('crave-spin-wheel-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
        isSpinning = false;
    }

    // Spin the wheel
    function spin() {
        if (isSpinning) return;
        
        const canSpin = engine ? engine.canSpinWheel() : { canSpin: false, reason: 'System not available' };
        
        if (!canSpin.canSpin) {
            hideWheel();
            return;
        }
        
        isSpinning = true;
        
        const spinBtn = document.getElementById('crave-spin-button');
        spinBtn.disabled = true;
        
        const result = engine ? engine.spinWheel() : null;
        
        if (!result || !result.success) {
            isSpinning = false;
            spinBtn.disabled = false;
            return;
        }
        
        const prize = result.prize;
        const prizes = config ? config.spinWheel.prizes : [];
        const prizeIndex = prizes.findIndex(p => p.name === prize.name);
        const segmentAngle = 360 / prizes.length;
        
        // Calculate rotation
        const targetRotation = 360 * 5 + (360 - (prizeIndex * segmentAngle) - segmentAngle / 2);
        currentRotation += targetRotation;
        
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        
        // Show result after spin
        setTimeout(() => {
            showResult(prize);
            
            if (notifications) {
                notifications.wheelPrize(prize);
            }
            
            isSpinning = false;
        }, 5000);
    }

    // Show result
    function showResult(prize) {
        const result = document.getElementById('crave-spin-result');
        const icon = document.getElementById('crave-spin-result-icon');
        const title = document.getElementById('crave-spin-result-title');
        const text = document.getElementById('crave-spin-result-text');
        
        icon.textContent = prize.icon;
        title.textContent = 'You Won!';
        text.textContent = prize.name;
        
        result.classList.add('show');
    }

    // Public API
    return {
        init,
        show: showWheel,
        hide: hideWheel,
        spin
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CraveSpinWheel;
}

'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameState {
  currentQuestion: number;
  score: number;
  lives: number;
  streak: number;
  completedCategories: string[];
  timeRemaining: number;
  gamePhase: 'menu' | 'playing' | 'results' | 'leaderboard';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const CYBER_SECURITY_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the most common type of cyber attack that targets individuals?",
    options: ["DDoS Attack", "Phishing", "SQL Injection", "Man-in-the-Middle"],
    correctAnswer: 1,
    explanation: "Phishing is the most common cyber attack targeting individuals, using deceptive emails or messages to steal personal information.",
    category: "Social Engineering",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which of the following is NOT a strong password characteristic?",
    options: ["Contains special characters", "Is at least 12 characters long", "Uses personal information", "Includes numbers and letters"],
    correctAnswer: 2,
    explanation: "Strong passwords should never contain personal information as it makes them easier to guess or crack.",
    category: "Password Security",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "What does HTTPS stand for?",
    options: ["HyperText Transfer Protocol Secure", "HyperText Transfer Protocol Standard", "HyperText Transfer Protocol System", "HyperText Transfer Protocol Service"],
    correctAnswer: 0,
    explanation: "HTTPS stands for HyperText Transfer Protocol Secure, providing encrypted communication over a computer network.",
    category: "Network Security",
    difficulty: "easy"
  },
  {
    id: 4,
    question: "What is the primary purpose of a firewall?",
    options: ["To encrypt data", "To monitor network traffic", "To prevent unauthorized access", "To backup files"],
    correctAnswer: 2,
    explanation: "A firewall's primary purpose is to prevent unauthorized access to or from a private network by filtering traffic.",
    category: "Network Security",
    difficulty: "medium"
  },
  {
    id: 5,
    question: "Which type of malware is designed to replicate itself and spread to other computers?",
    options: ["Trojan", "Virus", "Spyware", "Adware"],
    correctAnswer: 1,
    explanation: "A virus is a type of malware that replicates itself and spreads to other computers, often causing damage.",
    category: "Malware",
    difficulty: "medium"
  },
  {
    id: 6,
    question: "What is two-factor authentication (2FA)?",
    options: ["Using two different passwords", "Using two different usernames", "Using two different authentication methods", "Using two different devices"],
    correctAnswer: 2,
    explanation: "Two-factor authentication uses two different authentication methods (like password + SMS code) to verify identity.",
    category: "Authentication",
    difficulty: "medium"
  },
  {
    id: 7,
    question: "What does SQL injection attack target?",
    options: ["Email systems", "Database systems", "Network routers", "Operating systems"],
    correctAnswer: 1,
    explanation: "SQL injection attacks target database systems by inserting malicious SQL code into input fields.",
    category: "Web Security",
    difficulty: "hard"
  },
  {
    id: 8,
    question: "What is the main difference between encryption and hashing?",
    options: ["Encryption is reversible, hashing is not", "Hashing is reversible, encryption is not", "They are the same thing", "Encryption is faster than hashing"],
    correctAnswer: 0,
    explanation: "Encryption is reversible (can be decrypted), while hashing is a one-way function that cannot be reversed.",
    category: "Cryptography",
    difficulty: "hard"
  },
  {
    id: 9,
    question: "What is a zero-day vulnerability?",
    options: ["A vulnerability that has been fixed", "A vulnerability that is unknown to the vendor", "A vulnerability that affects zero systems", "A vulnerability that is very old"],
    correctAnswer: 1,
    explanation: "A zero-day vulnerability is a security flaw that is unknown to the software vendor and has no available patch.",
    category: "Vulnerabilities",
    difficulty: "hard"
  },
  {
    id: 10,
    question: "What is the purpose of a VPN?",
    options: ["To increase internet speed", "To create a secure connection over the internet", "To block all websites", "To store files online"],
    correctAnswer: 1,
    explanation: "A VPN (Virtual Private Network) creates a secure, encrypted connection over the internet to protect your data.",
    category: "Network Security",
    difficulty: "medium"
  },
  {
    id: 11,
    question: "What is pretexting in social engineering?",
    options: ["Creating fake websites", "Using a false identity to gain information", "Sending spam emails", "Installing malware"],
    correctAnswer: 1,
    explanation: "Pretexting is a social engineering technique where attackers create a false identity or scenario to trick victims into revealing sensitive information.",
    category: "Social Engineering",
    difficulty: "medium"
  },
  {
    id: 12,
    question: "What is the main difference between symmetric and asymmetric encryption?",
    options: ["Symmetric is faster", "Asymmetric uses two keys, symmetric uses one", "Symmetric is more secure", "Asymmetric is older"],
    correctAnswer: 1,
    explanation: "Asymmetric encryption uses a public-private key pair, while symmetric encryption uses a single shared key for both encryption and decryption.",
    category: "Cryptography",
    difficulty: "hard"
  },
  {
    id: 13,
    question: "What is a rootkit?",
    options: ["A type of virus", "Malware that hides its presence", "A firewall program", "An antivirus software"],
    correctAnswer: 1,
    explanation: "A rootkit is malicious software designed to hide its presence and maintain persistent access to a computer system while remaining undetected.",
    category: "Malware",
    difficulty: "hard"
  },
  {
    id: 14,
    question: "What is the principle of least privilege?",
    options: ["Users should have maximum access", "Users should have only the minimum access needed", "All users should have equal access", "Access should be granted randomly"],
    correctAnswer: 1,
    explanation: "The principle of least privilege states that users should be granted only the minimum level of access necessary to perform their job functions.",
    category: "Authentication",
    difficulty: "medium"
  },
  {
    id: 15,
    question: "What is cross-site scripting (XSS)?",
    options: ["A type of virus", "Injecting malicious scripts into web pages", "A network protocol", "A database attack"],
    correctAnswer: 1,
    explanation: "XSS is a web security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.",
    category: "Web Security",
    difficulty: "hard"
  },
  {
    id: 16,
    question: "What is a buffer overflow vulnerability?",
    options: ["A network issue", "When a program writes data beyond allocated memory", "A database error", "A firewall problem"],
    correctAnswer: 1,
    explanation: "A buffer overflow occurs when a program writes more data to a buffer than it can hold, potentially allowing attackers to execute malicious code.",
    category: "Vulnerabilities",
    difficulty: "hard"
  },
  {
    id: 17,
    question: "What is multi-factor authentication (MFA)?",
    options: ["Using multiple passwords", "Using multiple authentication methods", "Using multiple usernames", "Using multiple devices"],
    correctAnswer: 1,
    explanation: "MFA requires users to provide two or more verification factors to gain access to a resource, such as something you know, have, or are.",
    category: "Authentication",
    difficulty: "easy"
  },
  {
    id: 18,
    question: "What is a denial-of-service (DoS) attack?",
    options: ["Stealing data", "Making a service unavailable", "Installing malware", "Breaking encryption"],
    correctAnswer: 1,
    explanation: "A DoS attack aims to make a machine or network resource unavailable to its intended users by overwhelming it with traffic or requests.",
    category: "Network Security",
    difficulty: "medium"
  }
];

const CATEGORIES = [
  { name: "Social Engineering", color: "bg-black border border-white", icon: "◊" },
  { name: "Password Security", color: "bg-white text-black", icon: "■" },
  { name: "Network Security", color: "bg-black border border-white", icon: "●" },
  { name: "Malware", color: "bg-white text-black", icon: "▲" },
  { name: "Authentication", color: "bg-black border border-white", icon: "◆" },
  { name: "Web Security", color: "bg-white text-black", icon: "◊" },
  { name: "Cryptography", color: "bg-black border border-white", icon: "◈" },
  { name: "Vulnerabilities", color: "bg-white text-black", icon: "◉" }
];

export default function CyberSecurityGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    lives: 3,
    streak: 0,
    completedCategories: [],
    timeRemaining: 30,
    gamePhase: 'menu'
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [typingText, setTypingText] = useState('');
  const [showMatrix, setShowMatrix] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Particle system
  useEffect(() => {
    if (gameState.gamePhase === 'playing') {
      const createParticle = (): Particle => ({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 100,
        maxLife: 100
      });

      const animate = () => {
        setParticles(prev => 
          prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1
          })).filter(p => p.life > 0)
        );

        if (Math.random() < 0.1) {
          setParticles(prev => [...prev, createParticle()]);
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [gameState.gamePhase]);

  // Matrix background effect
  useEffect(() => {
    if (gameState.gamePhase === 'menu' || gameState.gamePhase === 'playing') {
      setShowMatrix(true);
    } else {
      setShowMatrix(false);
    }
  }, [gameState.gamePhase]);

  // Typing animation for questions
  useEffect(() => {
    if (gameState.gamePhase === 'playing' && shuffledQuestions.length > 0) {
      const currentQ = shuffledQuestions[gameState.currentQuestion];
      setTypingText('');
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < currentQ.question.length) {
          setTypingText(currentQ.question.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);
      return () => clearInterval(typeInterval);
    }
  }, [gameState.currentQuestion, shuffledQuestions, gameState.gamePhase]);

  // Timer effect
  useEffect(() => {
    if (gameState.gamePhase === 'playing' && gameState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.gamePhase === 'playing' && gameState.timeRemaining === 0) {
      handleTimeUp();
    }
  }, [gameState.timeRemaining, gameState.gamePhase]);

  const shuffleQuestions = () => {
    const shuffled = [...CYBER_SECURITY_QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  };

  const startGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name to start the game!');
      return;
    }
    shuffleQuestions();
    setGameState({
      currentQuestion: 0,
      score: 0,
      lives: 3,
      streak: 0,
      completedCategories: [],
      timeRemaining: 30,
      gamePhase: 'playing'
    });
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const currentQ = shuffledQuestions[gameState.currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    // Create explosion particles for correct answers
    if (isCorrect) {
      for (let i = 0; i < 20; i++) {
        setParticles(prev => [...prev, {
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 60,
          maxLife: 60
        }]);
      }
    }
    
    setTimeout(() => {
      setShowExplanation(true);
      
      setTimeout(() => {
        if (isCorrect) {
          const newScore = gameState.score + (currentQ.difficulty === 'easy' ? 10 : currentQ.difficulty === 'medium' ? 20 : 30);
          const newStreak = gameState.streak + 1;
          const streakBonus = Math.floor(newStreak / 3) * 5;
          
          // Check for achievements
          const newAchievements: string[] = [];
          if (newStreak === 3 && !achievements.includes('⚡ Hot Streak!')) {
            newAchievements.push('⚡ Hot Streak!');
          }
          if (newStreak === 5 && !achievements.includes('◆ Lightning Fast!')) {
            newAchievements.push('◆ Lightning Fast!');
          }
          if (newScore >= 100 && !achievements.includes('▲ Centurion!')) {
            newAchievements.push('▲ Centurion!');
          }
          if (newScore >= 200 && !achievements.includes('◉ Master Hacker!')) {
            newAchievements.push('◉ Master Hacker!');
          }
          
          setAchievements(prev => [...prev, ...newAchievements]);
          
          setGameState(prev => ({
            ...prev,
            score: newScore + streakBonus,
            streak: newStreak,
            currentQuestion: prev.currentQuestion + 1,
            timeRemaining: 30
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            lives: prev.lives - 1,
            streak: 0,
            currentQuestion: prev.currentQuestion + 1,
            timeRemaining: 30
          }));
        }
        
        setSelectedAnswer(null);
        setShowExplanation(false);
        
        // Check if game should end
        if (gameState.lives <= 1 || gameState.currentQuestion >= shuffledQuestions.length - 1) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, gamePhase: 'results' }));
          }, 1000);
        }
      }, 3000);
    }, 1000);
  };

  const handleTimeUp = () => {
    setGameState(prev => ({
      ...prev,
      lives: prev.lives - 1,
      streak: 0,
      currentQuestion: prev.currentQuestion + 1,
      timeRemaining: 30
    }));
    
    if (gameState.lives <= 1 || gameState.currentQuestion >= shuffledQuestions.length - 1) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, gamePhase: 'results' }));
      }, 1000);
    }
  };

  const resetGame = () => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      lives: 3,
      streak: 0,
      completedCategories: [],
      timeRemaining: 30,
      gamePhase: 'menu'
    });
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const getScoreMessage = () => {
    if (gameState.score >= 200) return "◉ Cyber Security Expert!";
    if (gameState.score >= 150) return "◆ Advanced Defender!";
    if (gameState.score >= 100) return "▲ Security Specialist!";
    if (gameState.score >= 50) return "● Cyber Warrior!";
    return "■ Keep Learning!";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-white';
      case 'medium': return 'text-white';
      case 'hard': return 'text-white';
      default: return 'text-white';
    }
  };

  // Matrix background component
  const MatrixBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
      if (!showMatrix) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const chars = '01';
      const charArray = chars.split('');
      const fontSize = 14;
      const columns = canvas.width / fontSize;
      const drops: number[] = [];
      
      for (let i = 0; i < columns; i++) {
        drops[i] = 1;
      }
      
      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
          const text = charArray[Math.floor(Math.random() * charArray.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };
      
      const interval = setInterval(draw, 50);
      return () => clearInterval(interval);
    }, [showMatrix]);
    
    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{ zIndex: -1 }}
      />
    );
  };

  if (gameState.gamePhase === 'menu') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <MatrixBackground />
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-white mb-4">
              ⚡ Cyber Defense Academy
            </h1>
            <p className="text-xl text-white mb-8 animate-bounce">
              Master cybersecurity concepts through interactive gameplay!
            </p>
          </div>

          <div className="bg-black border border-white rounded-2xl p-8">
            <div className="mb-6">
              <label className="block text-lg font-semibold text-white mb-2">
                Enter Your Name:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full p-3 bg-black border border-white rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Your name here..."
                maxLength={20}
              />
            </div>

            <button
              onClick={startGame}
              className="w-full bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25 animate-pulse"
            >
              ▶ Start Cyber Training
            </button>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((category, index) => (
                <div key={index} className={`${category.color} p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-white/10 animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-semibold">{category.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gamePhase === 'playing') {
    const currentQ = shuffledQuestions[gameState.currentQuestion];
    const progress = ((gameState.currentQuestion + 1) / shuffledQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-black p-4 relative overflow-hidden">
        <MatrixBackground />
        
        {/* Particle System */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full opacity-50"
              style={{
                left: particle.x,
                top: particle.y,
                opacity: particle.life / particle.maxLife,
                transform: `scale(${particle.life / particle.maxLife})`
              }}
            />
          ))}
        </div>
        <div className="max-w-4xl mx-auto relative" style={{ zIndex: 2 }}>
          {/* Achievement Notifications */}
          {achievements.slice(-3).map((achievement, index) => (
            <div
              key={achievement}
              className="fixed top-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg animate-bounce"
              style={{ 
                zIndex: 1000,
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1s'
              }}
            >
              {achievement}
            </div>
          ))}
          
          {/* Header */}
          <div className="bg-black border border-white rounded-xl p-4 mb-6 transform transition-all duration-300 hover:scale-105">
            <div className="flex justify-between items-center mb-4">
              <div className="text-white">
                <h2 className="text-2xl font-bold">Player: {playerName}</h2>
                <p className="text-white">Question {gameState.currentQuestion + 1} of {shuffledQuestions.length}</p>
              </div>
              <div className="text-right text-white">
                <div className="text-2xl font-bold text-white">Score: {gameState.score}</div>
                <div className="text-lg">Streak: {gameState.streak} ⚡</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white">Lives:</span>
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < gameState.lives ? 'text-white' : 'text-black'}`}>
                      ●
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white">Time:</span>
                  <span className={`text-xl font-bold ${gameState.timeRemaining <= 10 ? 'text-white' : 'text-white'}`}>
                    {gameState.timeRemaining}s
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">Progress</div>
                <div className="w-32 bg-black border border-white rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-black border border-white rounded-2xl p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(currentQ.difficulty)} bg-black border border-white`}>
                {currentQ.difficulty.toUpperCase()}
              </div>
              <div className="flex items-center space-x-2 text-white">
                <span>{CATEGORIES.find(c => c.name === currentQ.category)?.icon}</span>
                <span className="text-sm">{currentQ.category}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed min-h-[3rem]">
              {typingText}
              <span className="animate-pulse">|</span>
            </h3>

            <div className="grid gap-4">
              {currentQ.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 font-semibold ";
                
                if (selectedAnswer !== null) {
                  if (index === currentQ.correctAnswer) {
                    buttonClass += "border-white bg-white text-black";
                  } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                    buttonClass += "border-black bg-black text-white";
                  } else {
                    buttonClass += "border-white bg-black text-white";
                  }
                } else {
                  buttonClass += "border-white bg-black text-white hover:border-black hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg hover:shadow-white/10";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={buttonClass}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-black border border-white rounded-lg">
                <h4 className="text-lg font-bold text-white mb-2">◈ Explanation:</h4>
                <p className="text-white">{currentQ.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gamePhase === 'results') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <MatrixBackground />
        <div className="max-w-2xl w-full relative" style={{ zIndex: 2 }}>
          <div className="bg-black border border-white rounded-2xl p-8 text-center transform transition-all duration-500 hover:scale-105">
            <div className="text-6xl mb-4 animate-bounce">◉</div>
            <h1 className="text-4xl font-bold text-white mb-4 animate-pulse">Training Complete!</h1>
            <h2 className="text-2xl font-bold text-white mb-6 animate-fade-in">{getScoreMessage()}</h2>
            
            <div className="bg-white border border-black rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-black">
                <div>
                  <div className="text-3xl font-bold text-black">{gameState.score}</div>
                  <div className="text-black">Final Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">{gameState.currentQuestion}</div>
                  <div className="text-black">Questions Answered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">{3 - gameState.lives}</div>
                  <div className="text-black">Lives Lost</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-black">{gameState.streak}</div>
                  <div className="text-black">Best Streak</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={resetGame}
                className="w-full bg-white text-black hover:bg-black hover:text-white hover:border-white border border-black font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25 animate-pulse"
              >
                ◀ Play Again
              </button>
              
              <div className="text-white text-sm">
                <p>Keep practicing to become a cybersecurity expert!</p>
                <p className="mt-2">◈ Tip: Review the explanations to learn more about each topic.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, Target, BarChart3, Award } from 'lucide-react';

const ProgressTracking = () => {
  const stats = [
    {
      label: 'Total Sessions',
      value: '24',
      change: '+12%',
      icon: BarChart3,
      color: 'text-primary'
    },
    {
      label: 'Hours Practiced',
      value: '18.5',
      change: '+8%',
      icon: Clock,
      color: 'text-accent'
    },
    {
      label: 'Completed Interviews',
      value: '15',
      change: '+15%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Success Rate',
      value: '85%',
      change: '+5%',
      icon: Target,
      color: 'text-blue-600'
    }
  ];

  const recentActivities = [
    {
      type: 'Mock Interview',
      date: '2 hours ago',
      score: '92%',
      status: 'Completed'
    },
    {
      type: 'Coding Interview',
      date: '1 day ago',
      score: '88%',
      status: 'Completed'
    },
    {
      type: 'General Interview',
      date: '2 days ago',
      score: '90%',
      status: 'Completed'
    },
    {
      type: 'Phone Interview',
      date: '3 days ago',
      score: '85%',
      status: 'Completed'
    }
  ];

  const skillProgress = [
    { skill: 'Communication', progress: 85, color: 'bg-primary' },
    { skill: 'Technical Skills', progress: 78, color: 'bg-accent' },
    { skill: 'Problem Solving', progress: 92, color: 'bg-green-500' },
    { skill: 'Confidence', progress: 88, color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="glass-card p-6 rounded-xl hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r from-primary/10 to-accent/10 shadow-glow`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Progress */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Skill Progress</h3>
          </div>
          <div className="space-y-4">
            {skillProgress.map((skill, index) => (
              <div key={skill.skill}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                  <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${skill.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors">
                <div>
                  <div className="font-medium text-foreground">{activity.type}</div>
                  <div className="text-sm text-muted-foreground">{activity.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">{activity.score}</div>
                  <div className="text-xs text-green-600">{activity.status}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressTracking;

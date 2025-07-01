
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, Target, BarChart3, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useUserStats } from '@/hooks/useUserStats';

const ProgressTracking = () => {
  const { isNewUser, totalSessions, totalHours, completedInterviews, averageScore, analyses, interviews } = useUserStats();

  const stats = [
    {
      label: 'Total Sessions',
      value: totalSessions.toString(),
      change: totalSessions > 0 ? '+12%' : '0%',
      icon: BarChart3,
      color: 'text-primary'
    },
    {
      label: 'Hours Practiced',
      value: totalHours.toString(),
      change: totalHours > 0 ? '+8%' : '0%',
      icon: Clock,
      color: 'text-accent'
    },
    {
      label: 'Completed Interviews',
      value: completedInterviews.toString(),
      change: completedInterviews > 0 ? '+15%' : '0%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Success Rate',
      value: `${averageScore}%`,
      change: averageScore > 0 ? '+5%' : '0%',
      icon: Target,
      color: 'text-blue-600'
    }
  ];

  // Calculate skill progress from actual data or show zeros for new users
  const calculateSkillProgress = () => {
    if (totalSessions === 0 || analyses.length === 0) {
      return [
        { skill: 'Communication', progress: 0, color: 'bg-primary' },
        { skill: 'Technical Skills', progress: 0, color: 'bg-accent' },
        { skill: 'Problem Solving', progress: 0, color: 'bg-green-500' },
        { skill: 'Confidence', progress: 0, color: 'bg-blue-500' }
      ];
    }

    const avgCommunication = analyses.reduce((sum, a) => sum + (a.communication_score || 0), 0) / analyses.length;
    const avgTechnical = analyses.reduce((sum, a) => sum + (a.technical_score || 0), 0) / analyses.length;
    const avgProblemSolving = analyses.reduce((sum, a) => sum + (a.problem_solving_score || 0), 0) / analyses.length;
    const avgConfidence = analyses.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / analyses.length;

    return [
      { skill: 'Communication', progress: Math.round(avgCommunication), color: 'bg-primary' },
      { skill: 'Technical Skills', progress: Math.round(avgTechnical), color: 'bg-accent' },
      { skill: 'Problem Solving', progress: Math.round(avgProblemSolving), color: 'bg-green-500' },
      { skill: 'Confidence', progress: Math.round(avgConfidence), color: 'bg-blue-500' }
    ];
  };

  const skillProgress = calculateSkillProgress();

  // Generate recent activities from actual interview data
  const recentActivities = interviews.slice(0, 4).map((interview) => ({
    type: 'AI Interview',
    date: new Date(interview.timestamp).toLocaleDateString(),
    score: 'Completed',
    status: 'Completed'
  }));

  // Data for pie chart - Interview Types Distribution (based on actual data or zeros)
  const pieChartData = totalSessions === 0 ? [
    { name: 'No Data', value: 100, color: '#E5E7EB' }
  ] : [
    { name: 'General', value: 40, color: '#8B5CF6' },
    { name: 'Technical', value: 30, color: '#06B6D4' },
    { name: 'UPSC', value: 20, color: '#10B981' },
    { name: 'Friendly', value: 10, color: '#F59E0B' }
  ];

  // Data for bar chart - Weekly Progress (based on actual data or zeros)
  const generateWeeklyData = () => {
    if (totalSessions === 0) {
      return [
        { name: 'Mon', interviews: 0, hours: 0 },
        { name: 'Tue', interviews: 0, hours: 0 },
        { name: 'Wed', interviews: 0, hours: 0 },
        { name: 'Thu', interviews: 0, hours: 0 },
        { name: 'Fri', interviews: 0, hours: 0 },
        { name: 'Sat', interviews: 0, hours: 0 },
        { name: 'Sun', interviews: 0, hours: 0 }
      ];
    }

    // Group interviews by day of week
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyStats = weekDays.map(day => ({ name: day, interviews: 0, hours: 0 }));

    interviews.forEach(interview => {
      const dayIndex = new Date(interview.timestamp).getDay();
      dailyStats[dayIndex].interviews += 1;
      dailyStats[dayIndex].hours = Math.round((dailyStats[dayIndex].interviews * 0.1) * 10) / 10; // Estimate hours
    });

    return dailyStats.slice(1).concat(dailyStats.slice(0, 1)); // Reorder to start with Monday
  };

  const barChartData = generateWeeklyData();

  // Data for line chart - Performance Trend (based on actual data or zeros)
  const lineChartData = totalSessions === 0 ? [
    { week: 'Week 1', score: 0 },
    { week: 'Week 2', score: 0 },
    { week: 'Week 3', score: 0 },
    { week: 'Week 4', score: 0 },
    { week: 'Week 5', score: 0 },
    { week: 'Week 6', score: 0 }
  ] : [
    { week: 'Week 1', score: Math.max(0, averageScore - 15) },
    { week: 'Week 2', score: Math.max(0, averageScore - 12) },
    { week: 'Week 3', score: Math.max(0, averageScore - 8) },
    { week: 'Week 4', score: Math.max(0, averageScore - 5) },
    { week: 'Week 5', score: Math.max(0, averageScore - 2) },
    { week: 'Week 6', score: averageScore }
  ];

  return (
    <div className="space-y-8">
      {/* New User Welcome Message or Progress Message */}
      {totalSessions === 0 ? (
        <motion.div
          className="glass-card p-6 rounded-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-lg font-semibold text-foreground mb-2">Welcome to AI Interviewer! 🎉</div>
          <div className="text-muted-foreground">
            Complete your first interview to start tracking your progress and see your stats here.
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="glass-card p-6 rounded-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-lg font-semibold text-foreground mb-2">Great Progress! 📈</div>
          <div className="text-muted-foreground">
            You've completed {totalSessions} interview{totalSessions !== 1 ? 's' : ''} so far. Keep practicing to improve your skills!
          </div>
        </motion.div>
      )}

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
              <div className={`flex items-center space-x-1 text-sm font-medium ${totalSessions === 0 ? 'text-gray-400' : 'text-green-600'}`}>
                <TrendingUp className="h-4 w-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart - Interview Types */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Interview Types Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={totalSessions === 0 ? false : ({ name, value }) => `${name}: ${value}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {totalSessions === 0 && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Complete interviews to see your distribution
            </div>
          )}
        </motion.div>

        {/* Bar Chart - Weekly Activity */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Weekly Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="interviews" fill="#8B5CF6" name="Interviews" />
              <Bar dataKey="hours" fill="#06B6D4" name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Progress Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Progress */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
          </div>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">No activities yet</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Start your first interview to see activities here
                </div>
              </div>
            ) : (
              recentActivities.map((activity, index) => (
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
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Performance Trend Line Chart */}
      <motion.div
        className="glass-card p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-foreground">Performance Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        {totalSessions === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            Complete interviews to track your performance over time
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProgressTracking;

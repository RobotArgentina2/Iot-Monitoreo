import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Thermometer, Droplets, Clock, Activity, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const App = () => {
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState({ temperature: 0, humidity: 0, id: '--', time: '--' });

    const fetchData = async () => {
        try {
            const response = await fetch('/api/get-readings?limit=30');
            const result = await response.json();
            if (result.length > 0) {
                setData(result);
                const last = result[result.length - 1];
                setCurrent({
                    temperature: last.temperature,
                    humidity: last.humidity,
                    id: last.id,
                    time: new Date(last.recorded_at).toLocaleTimeString()
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const Card = ({ title, value, unit, icon: Icon, color, id }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon size={80} color={color} />
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-white/5">
                    <Icon size={24} color={color} />
                </div>
                <h3 className="text-slate-400 font-medium">{title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight text-white">{value}</span>
                <span className="text-xl text-slate-400">{unit}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Database size={12} />
                <span>Registro ID: {id}</span>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen p-8 bg-[#0f172a] selection:bg-sky-500/30">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold tracking-wider uppercase">
                                Agente 3 • En Linea
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">IoT Intelligence System</h1>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-4 glass-card p-4 rounded-2xl">
                        <Clock className="text-sky-400" size={20} />
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Última Actualización</p>
                            <p className="text-lg font-mono text-white">{current.time}</p>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <Card
                        title="Temperatura"
                        value={current.temperature}
                        unit="°C"
                        icon={Thermometer}
                        color="#f43f5e"
                        id={current.id}
                    />
                    <Card
                        title="Humedad"
                        value={current.humidity}
                        unit="%"
                        icon={Droplets}
                        color="#0ea5e9"
                        id={current.id}
                    />
                    <Card
                        title="Estado del Sistema"
                        value="Activo"
                        unit=""
                        icon={Activity}
                        color="#10b981"
                        id="Server: OK"
                    />
                </div>

                {/* Charts Section */}
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            Análisis Temporal de Datos
                        </h3>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="recorded_at"
                                    stroke="#475569"
                                    tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="temperature"
                                    name="Temp °C"
                                    stroke="#f43f5e"
                                    fillOpacity={1}
                                    fill="url(#colorTemp)"
                                    strokeWidth={3}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="humidity"
                                    name="Hum %"
                                    stroke="#0ea5e9"
                                    fillOpacity={1}
                                    fill="url(#colorHum)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;

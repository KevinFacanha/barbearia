import { useState } from 'react';
import { format, parseISO, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Scissors, History } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../components/AuthProvider';

const WORKING_HOURS = {
  start: 8,
  end: 19.5,
  interval: 30,
};

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2024-03-25',
      time: '14:30',
      status: 'scheduled'
    },
    {
      id: '2',
      date: '2024-03-20',
      time: '10:00',
      status: 'completed'
    }
  ]);

  const generateTimeSlots = () => {
    const slots = [];
    let currentHour = WORKING_HOURS.start;

    while (currentHour <= WORKING_HOURS.end) {
      const hour = Math.floor(currentHour);
      const minutes = (currentHour % 1) * 60;
      
      const time = setMinutes(setHours(new Date(), hour), minutes);
      slots.push(format(time, 'HH:mm'));
      
      currentHour += WORKING_HOURS.interval / 60;
    }

    return slots;
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) return;
    
    const newAppointment = {
      id: Math.random().toString(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      status: 'scheduled' as const
    };

    // Add new appointment and keep only the 5 most recent ones
    setAppointments(prev => {
      const updatedAppointments = [newAppointment, ...prev]
        .sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5);
      return updatedAppointments;
    });
    
    setSelectedDate(new Date());
    setSelectedTime(null);
  };

  // Sort appointments by date and time, most recent first
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  }).slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-zinc-800" />
              <div className="ml-4">
                <h2 className="text-sm font-medium text-zinc-500">
                  Próximo Agendamento
                </h2>
                <p className="text-2xl font-bold text-zinc-800">
                  {appointments.find(a => a.status === 'scheduled')
                    ? format(parseISO(appointments.find(a => a.status === 'scheduled')!.date), "dd 'de' MMMM", { locale: ptBR })
                    : 'Nenhum agendamento'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <History className="w-8 h-8 text-zinc-800" />
              <div className="ml-4">
                <h2 className="text-sm font-medium text-zinc-500">
                  Cortes Realizados
                </h2>
                <p className="text-2xl font-bold text-zinc-800">
                  {appointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center">
              <Scissors className="w-6 h-6 mr-2" />
              Agendar Novo Corte
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Selecione a Data
                </label>
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(parseISO(e.target.value))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Selecione o Horário
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {generateTimeSlots().map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded-lg text-center transition-colors ${
                        selectedTime === time
                          ? 'bg-zinc-800 text-white'
                          : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-zinc-800 text-white py-3 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-zinc-800 mb-6 flex items-center justify-between">
              <span>Meus Agendamentos</span>
              <span className="text-sm text-zinc-500 font-normal">
                Últimos 5 agendamentos
              </span>
            </h2>

            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-zinc-50"
                >
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                    <div>
                      <p className="font-medium text-zinc-800">
                        {format(parseISO(appointment.date), "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {appointment.time}h
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {appointment.status === 'completed'
                      ? 'Concluído'
                      : appointment.status === 'cancelled'
                      ? 'Cancelado'
                      : 'Agendado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
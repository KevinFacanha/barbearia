import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Users, CheckCircle, Calendar, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import type { Appointment } from '../types';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [completedToday, setCompletedToday] = useState(0);

  useEffect(() => {
    // Mock data for development
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        user_id: '2',
        client_name: 'João Silva',
        appointment_date: '2024-03-20T14:30:00Z',
        status: 'scheduled',
        created_at: '2024-03-19T10:00:00Z'
      },
      {
        id: '2',
        user_id: '3',
        client_name: 'Maria Oliveira',
        appointment_date: '2024-03-20T15:00:00Z',
        status: 'completed',
        created_at: '2024-03-19T11:00:00Z'
      },
      {
        id: '3',
        user_id: '4',
        client_name: 'Pedro Santos',
        appointment_date: '2024-03-20T16:00:00Z',
        status: 'scheduled',
        created_at: '2024-03-19T12:00:00Z'
      }
    ];

    setAppointments(mockAppointments);
    setCompletedToday(mockAppointments.filter(a => a.status === 'completed').length);
  }, []);

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'completed' }
          : appointment
      )
    );
    setCompletedToday(prev => prev + 1);
  };

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
                  Agendamentos Hoje
                </h2>
                <p className="text-2xl font-bold text-zinc-800">
                  {appointments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-zinc-800" />
              <div className="ml-4">
                <h2 className="text-sm font-medium text-zinc-500">
                  Atendimentos Concluídos
                </h2>
                <p className="text-2xl font-bold text-zinc-800">
                  {completedToday}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200">
            <h2 className="text-lg font-semibold text-zinc-800">
              Agendamentos do Dia
            </h2>
          </div>

          <div className="divide-y divide-zinc-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Users className="w-10 h-10 text-zinc-400" />
                    <div>
                      <h3 className="text-lg font-medium text-zinc-800">
                        {appointment.client_name}
                      </h3>
                      <div className="flex items-center text-zinc-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {format(new Date(appointment.appointment_date), "HH:mm 'h'")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
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
                    
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => handleCompleteAppointment(appointment.id)}
                        className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
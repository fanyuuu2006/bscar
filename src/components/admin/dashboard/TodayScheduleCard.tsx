import { SupabaseBooking, SupabaseService } from "@/types"
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents"

type TodayScheduleCardProps = OverrideProps<
    React.HTMLAttributes<HTMLDivElement>,   
    {
        booking: SupabaseBooking;
        service?: SupabaseService;
    }
>;
export const TodayScheduleCard = ({ booking, service, className,  ...props }: TodayScheduleCardProps) => {
    const startTime = new Date(booking.booking_time);
    const endTime = new Date(startTime.getTime() + (service?.duration || 0) * 60000);

  return (
    <div className={cn(`bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-lg p-4 flex justify-between items-center`, className)} {...props}>
        <div className="flex flex-col gap-1">
             <h3 className="font-semibold text-gray-900">{service?.name || "未知服務"}</h3>
             <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{booking.customer_name}</span>
                <span>•</span>
                <span>{booking.customer_phone}</span>
             </div>
        </div>
        <div className="flex flex-col items-end gap-1">
             <p className="text-sm font-medium text-gray-700 font-mono">
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {' - '}
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </p>
             <span className={cn("px-2 py-0.5 text-xs rounded-full", 
                booking.status === 'confirmed' ? "bg-green-50 text-green-700 border border-green-200" :
                booking.status === 'pending' ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                booking.status === 'completed' ? "bg-blue-50 text-blue-700 border border-blue-200" :
                "bg-gray-50 text-gray-700 border border-gray-200"
             )}>
                {booking.status === 'pending' && '待確認'}
                {booking.status === 'confirmed' && '已確認'}
                {booking.status === 'completed' && '已完成'}
                {booking.status === 'cancelled' && '已取消'}
             </span>
        </div>
    </div>
    )
};
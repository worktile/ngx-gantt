import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';
export default {
    id: GanttI18nLocale.jaJp,
    views: {
        [GanttViewType.hour]: {
            label: '毎時',
            dateFormats: {
                primary: 'M月d日',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: '日',
            dateFormats: {
                primary: 'yyyy年M月d日',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: '週',
            dateFormats: {
                primary: 'yyyy年',
                secondary: '第w週'
            }
        },
        [GanttViewType.month]: {
            label: '月',
            dateFormats: {
                primary: `yyyy年M月`,
                secondary: 'M月'
            }
        },
        [GanttViewType.quarter]: {
            label: '四半期',
            dateFormats: {
                primary: 'yyyy年',
                secondary: `yyyy年第Q四半期`
            }
        },
        [GanttViewType.year]: {
            label: '年',
            dateFormats: {
                secondary: 'yyyy年'
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamEtanAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvaTE4bi9sb2NhbGVzL2phLWpwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUUxQyxlQUFlO0lBQ1gsRUFBRSxFQUFFLGVBQWUsQ0FBQyxJQUFJO0lBQ3hCLEtBQUssRUFBRTtRQUNILENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLEtBQUssRUFBRSxJQUFJO1lBQ1gsV0FBVyxFQUFFO2dCQUNULE9BQU8sRUFBRSxNQUFNO2dCQUNmLFNBQVMsRUFBRSxPQUFPO2FBQ3JCO1NBQ0o7UUFDRCxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNqQixLQUFLLEVBQUUsR0FBRztZQUNWLFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsV0FBVztnQkFDcEIsU0FBUyxFQUFFLEdBQUc7YUFDakI7U0FDSjtRQUNELENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLEtBQUssRUFBRSxHQUFHO1lBQ1YsV0FBVyxFQUFFO2dCQUNULE9BQU8sRUFBRSxPQUFPO2dCQUNoQixTQUFTLEVBQUUsS0FBSzthQUNuQjtTQUNKO1FBQ0QsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbkIsS0FBSyxFQUFFLEdBQUc7WUFDVixXQUFXLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJO2FBQ2xCO1NBQ0o7UUFDRCxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNyQixLQUFLLEVBQUUsS0FBSztZQUNaLFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsT0FBTztnQkFDaEIsU0FBUyxFQUFFLFlBQVk7YUFDMUI7U0FDSjtRQUNELENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLEtBQUssRUFBRSxHQUFHO1lBQ1YsV0FBVyxFQUFFO2dCQUNULFNBQVMsRUFBRSxPQUFPO2FBQ3JCO1NBQ0o7S0FDSjtDQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHYW50dFZpZXdUeXBlIH0gZnJvbSAnLi4vLi4vY2xhc3MnO1xuaW1wb3J0IHsgR2FudHRJMThuTG9jYWxlIH0gZnJvbSAnLi4vaTE4bic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpZDogR2FudHRJMThuTG9jYWxlLmphSnAsXG4gICAgdmlld3M6IHtcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUuaG91cl06IHtcbiAgICAgICAgICAgIGxhYmVsOiAn5q+O5pmCJyxcbiAgICAgICAgICAgIGRhdGVGb3JtYXRzOiB7XG4gICAgICAgICAgICAgICAgcHJpbWFyeTogJ03mnIhk5pelJyxcbiAgICAgICAgICAgICAgICBzZWNvbmRhcnk6ICdISDptbSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUuZGF5XToge1xuICAgICAgICAgICAgbGFiZWw6ICfml6UnLFxuICAgICAgICAgICAgZGF0ZUZvcm1hdHM6IHtcbiAgICAgICAgICAgICAgICBwcmltYXJ5OiAneXl5eeW5tE3mnIhk5pelJyxcbiAgICAgICAgICAgICAgICBzZWNvbmRhcnk6ICdkJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbR2FudHRWaWV3VHlwZS53ZWVrXToge1xuICAgICAgICAgICAgbGFiZWw6ICfpgLEnLFxuICAgICAgICAgICAgZGF0ZUZvcm1hdHM6IHtcbiAgICAgICAgICAgICAgICBwcmltYXJ5OiAneXl5eeW5tCcsXG4gICAgICAgICAgICAgICAgc2Vjb25kYXJ5OiAn56ysd+mAsSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUubW9udGhdOiB7XG4gICAgICAgICAgICBsYWJlbDogJ+aciCcsXG4gICAgICAgICAgICBkYXRlRm9ybWF0czoge1xuICAgICAgICAgICAgICAgIHByaW1hcnk6IGB5eXl55bm0TeaciGAsXG4gICAgICAgICAgICAgICAgc2Vjb25kYXJ5OiAnTeaciCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUucXVhcnRlcl06IHtcbiAgICAgICAgICAgIGxhYmVsOiAn5Zub5Y2K5pyfJyxcbiAgICAgICAgICAgIGRhdGVGb3JtYXRzOiB7XG4gICAgICAgICAgICAgICAgcHJpbWFyeTogJ3l5eXnlubQnLFxuICAgICAgICAgICAgICAgIHNlY29uZGFyeTogYHl5eXnlubTnrKxR5Zub5Y2K5pyfYFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBbR2FudHRWaWV3VHlwZS55ZWFyXToge1xuICAgICAgICAgICAgbGFiZWw6ICflubQnLFxuICAgICAgICAgICAgZGF0ZUZvcm1hdHM6IHtcbiAgICAgICAgICAgICAgICBzZWNvbmRhcnk6ICd5eXl55bm0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiJdfQ==
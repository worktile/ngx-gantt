import { de } from 'date-fns/locale';
import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';
export default {
    id: GanttI18nLocale.deDe,
    dateLocale: de,
    views: {
        [GanttViewType.hour]: {
            label: 'Stündlich',
            dateFormats: {
                primary: 'dd. MMM',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Täglich',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'd'
            }
        },
        [GanttViewType.week]: {
            label: 'Wöchentlich',
            dateFormats: {
                primary: 'yyyy',
                secondary: `w. 'Woche'`
            }
        },
        [GanttViewType.month]: {
            label: 'Monatlich',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'MMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Vierteljährlich',
            dateFormats: {
                primary: 'yyyy',
                secondary: `Q. 'Quartal' yyyy`
            }
        },
        [GanttViewType.year]: {
            label: 'Jährlich',
            dateFormats: {
                secondary: 'yyyy'
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGUtZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9nYW50dC9zcmMvaTE4bi9sb2NhbGVzL2RlLWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNyQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFMUMsZUFBZTtJQUNYLEVBQUUsRUFBRSxlQUFlLENBQUMsSUFBSTtJQUN4QixVQUFVLEVBQUUsRUFBRTtJQUNkLEtBQUssRUFBRTtRQUNILENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLEtBQUssRUFBRSxXQUFXO1lBQ2xCLFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsU0FBUztnQkFDbEIsU0FBUyxFQUFFLE9BQU87YUFDckI7U0FDSjtRQUNELENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pCLEtBQUssRUFBRSxTQUFTO1lBQ2hCLFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsU0FBUyxFQUFFLEdBQUc7YUFDakI7U0FDSjtRQUNELENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xCLEtBQUssRUFBRSxhQUFhO1lBQ3BCLFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsTUFBTTtnQkFDZixTQUFTLEVBQUUsWUFBWTthQUMxQjtTQUNKO1FBQ0QsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbkIsS0FBSyxFQUFFLFdBQVc7WUFDbEIsV0FBVyxFQUFFO2dCQUNULE9BQU8sRUFBRSxVQUFVO2dCQUNuQixTQUFTLEVBQUUsS0FBSzthQUNuQjtTQUNKO1FBQ0QsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDckIsS0FBSyxFQUFFLGlCQUFpQjtZQUN4QixXQUFXLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsU0FBUyxFQUFFLG1CQUFtQjthQUNqQztTQUNKO1FBQ0QsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsS0FBSyxFQUFFLFVBQVU7WUFDakIsV0FBVyxFQUFFO2dCQUNULFNBQVMsRUFBRSxNQUFNO2FBQ3BCO1NBQ0o7S0FDSjtDQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZSB9IGZyb20gJ2RhdGUtZm5zL2xvY2FsZSc7XG5pbXBvcnQgeyBHYW50dFZpZXdUeXBlIH0gZnJvbSAnLi4vLi4vY2xhc3MnO1xuaW1wb3J0IHsgR2FudHRJMThuTG9jYWxlIH0gZnJvbSAnLi4vaTE4bic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpZDogR2FudHRJMThuTG9jYWxlLmRlRGUsXG4gICAgZGF0ZUxvY2FsZTogZGUsXG4gICAgdmlld3M6IHtcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUuaG91cl06IHtcbiAgICAgICAgICAgIGxhYmVsOiAnU3TDvG5kbGljaCcsXG4gICAgICAgICAgICBkYXRlRm9ybWF0czoge1xuICAgICAgICAgICAgICAgIHByaW1hcnk6ICdkZC4gTU1NJyxcbiAgICAgICAgICAgICAgICBzZWNvbmRhcnk6ICdISDptbSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUuZGF5XToge1xuICAgICAgICAgICAgbGFiZWw6ICdUw6RnbGljaCcsXG4gICAgICAgICAgICBkYXRlRm9ybWF0czoge1xuICAgICAgICAgICAgICAgIHByaW1hcnk6ICdNTU0geXl5eScsXG4gICAgICAgICAgICAgICAgc2Vjb25kYXJ5OiAnZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUud2Vla106IHtcbiAgICAgICAgICAgIGxhYmVsOiAnV8O2Y2hlbnRsaWNoJyxcbiAgICAgICAgICAgIGRhdGVGb3JtYXRzOiB7XG4gICAgICAgICAgICAgICAgcHJpbWFyeTogJ3l5eXknLFxuICAgICAgICAgICAgICAgIHNlY29uZGFyeTogYHcuICdXb2NoZSdgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtHYW50dFZpZXdUeXBlLm1vbnRoXToge1xuICAgICAgICAgICAgbGFiZWw6ICdNb25hdGxpY2gnLFxuICAgICAgICAgICAgZGF0ZUZvcm1hdHM6IHtcbiAgICAgICAgICAgICAgICBwcmltYXJ5OiAnTU1NIHl5eXknLFxuICAgICAgICAgICAgICAgIHNlY29uZGFyeTogJ01NTSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUucXVhcnRlcl06IHtcbiAgICAgICAgICAgIGxhYmVsOiAnVmllcnRlbGrDpGhybGljaCcsXG4gICAgICAgICAgICBkYXRlRm9ybWF0czoge1xuICAgICAgICAgICAgICAgIHByaW1hcnk6ICd5eXl5JyxcbiAgICAgICAgICAgICAgICBzZWNvbmRhcnk6IGBRLiAnUXVhcnRhbCcgeXl5eWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW0dhbnR0Vmlld1R5cGUueWVhcl06IHtcbiAgICAgICAgICAgIGxhYmVsOiAnSsOkaHJsaWNoJyxcbiAgICAgICAgICAgIGRhdGVGb3JtYXRzOiB7XG4gICAgICAgICAgICAgICAgc2Vjb25kYXJ5OiAneXl5eSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iXX0=
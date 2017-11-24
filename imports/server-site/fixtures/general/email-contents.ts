import { EmailContent } from '../../../both/models/general/email-content.model';
import { EmailContents } from '../../../both/collections/general/email-content.collection';

export function loadEmailContents() {
    if (EmailContents.find().cursor.count() === 0) {
        const emailContents: EmailContent[] = [
            {
                _id: '100',
                language: 'en',
                lang_dictionary: [
                    { label: 'chargeSoonEmailSubjectVar', traduction: 'Your monthly Iurest service will ends soon' },
                    { label: 'greetVar', traduction: 'Hello' },
                    { label: 'welcomeMsgVar', traduction: 'We got a request to reset you password, if it was you click the button above.' },
                    { label: 'btnTextVar', traduction: 'Reset' },
                    { label: 'beforeMsgVar', traduction: 'If you do not want to change the password, ignore this message.' },
                    { label: 'regardVar', traduction: 'Thanks, Iurest team.' },
                    { label: 'followMsgVar', traduction: 'Follow us on social networks' },
                    { label: 'reminderChargeSoonMsgVar', traduction: 'Remember that your monthly Iurest service for: ' },
                    { label: 'reminderChargeSoonMsgVar2', traduction: 'Ends on: ' },
                    { label: 'instructionchargeSoonMsgVar', traduction: 'If you want to continue using all the system features, entering with your email or username and select the menu Restaurants > Administration > Edit restaurant > # Tables' },
                    { label: 'reminderExpireSoonMsgVar', traduction: 'Remember that your monthly Iurest service for: ' },
                    { label: 'reminderExpireSoonMsgVar2', traduction: 'Expires on: ' },
                    { label: 'reminderExpireSoonMsgVar3', traduction: 'If you want to continue using all the system features, entering with your email or username and select the menu Payments > Monthly payment' },
                    { label: 'expireSoonEmailSubjectVar', traduction: 'Your Iurest service will expire soon'},
                    { label: 'reminderRestExpiredVar', traduction: 'Your monthly Iurest service for: '},
                    { label: 'reminderRestExpiredVar2', traduction: 'Has expired'},
                    { label: 'reminderRestExpiredVar3', traduction: 'If you want to continue using all the system features, entering with your email or username and select the menu Payments > Reactivate '},
                    { label: 'restExpiredEmailSubjectVar', traduction: 'Your Iurest service has expired'},
                    { label: 'resetPasswordSubjectVar', traduction: 'Reset your password on'}
                ]
            },
            {
                _id: '200',
                language: 'es',
                lang_dictionary: [
                    { label: 'chargeSoonEmailSubjectVar', traduction: 'Tu servicio mensual de Iurest terminará pronto' },
                    { label: 'greetVar', traduction: 'Hola' },
                    { label: 'welcomeMsgVar', traduction: 'Hemos recibido una petición para cambiar tu contraseña, si fuiste tu haz click en el botón abajo' },
                    { label: 'btnTextVar', traduction: 'Cambiar' },
                    { label: 'beforeMsgVar', traduction: 'Si no quieres cambiar la contraseña, ignora este mensaje.' },
                    { label: 'regardVar', traduction: 'Gracias, equipo Iurest' },
                    { label: 'followMsgVar', traduction: 'Siguenos en redes sociales' },
                    { label: 'reminderChargeSoonMsgVar', traduction: 'Recuerda que tu servicio mensual de Iurest para: ' },
                    { label: 'reminderChargeSoonMsgVar2', traduction: 'Finaliza el: ' },
                    { label: 'instructionchargeSoonMsgVar', traduction: 'Si deseas seguir usando todas las funcionalidades del sistema, ingresa con tu usuario o correo y selecciona el menú Restaurante > Administración > Editar restaurante > # Mesas' },
                    { label: 'reminderExpireSoonMsgVar', traduction: 'Recuerda que tu servicio mensual de Iurest para: ' },
                    { label: 'reminderExpireSoonMsgVar2', traduction: 'Expira el: ' },
                    { label: 'reminderExpireSoonMsgVar3', traduction: 'Si deseas seguir usando todas las funcionalidades del sistema, ingresa con tu usuario o correo y selecciona el menú Pagos > Pago mensual' },
                    { label: 'expireSoonEmailSubjectVar', traduction: 'Tu servicio Iurest expirará pronto'},
                    { label: 'reminderRestExpiredVar', traduction: 'Tu servicio mensual de Iurest para: '},
                    { label: 'reminderRestExpiredVar2', traduction: 'ha expirado'},
                    { label: 'reminderRestExpiredVar3', traduction: 'Si deseas seguir usando todas las funcionalidades del sistema, ingresa con tu usuario o correo y selecciona la opción Pagos > Reactivar '},
                    { label: 'restExpiredEmailSubjectVar', traduction: 'Tu servicio de Iurest ha expirado'},
                    { label: 'resetPasswordSubjectVar', traduction: 'Cambio de contraseña en'}
                ]
            }
        ];
        emailContents.forEach((emailContent: EmailContent) => EmailContents.insert(emailContent));
    }
}
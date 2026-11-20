# Semana 06 — Explicacion paso a paso (para sustentar)

Tema: Formularios con React Hook Form y Zod. Dominio: planta de reciclaje.
Cada paso = un commit. Ver con `git log --oneline`.

## Que se hizo
Dos formularios: crear un camion y editar un camion. Los dos validan con Zod y usan los mismos componentes.

```
Pantalla (Crear o Editar)
   useForm + zodResolver(recepcionSchema)
      |-- FormField   (Controller + TextInput + error)  -> placa, conductor, peso
      |-- SelectField (Controller + botones + error)    -> material, estado
   handleSubmit -> Zod valida -> onSubmit -> useMutation -> API
```

- **Zod** dice que es valido (reglas).
- **React Hook Form** maneja el estado del formulario.
- **zodResolver** conecta los dos.

## Reglas de validacion (schema)
| Campo | Regla | Mensaje |
| --- | --- | --- |
| placa | formato ABC-123 | "Formato de placa: ABC-123" |
| conductor | de 3 a 60 caracteres | "Minimo 3 caracteres" |
| material | plastico, carton, vidrio o metal | "Elige un material" |
| pesoKg | numero mayor que 0 y maximo 50000 | "El peso debe ser mayor que 0" |
| estado | en_bascula, descargando o finalizado | "Elige un estado" |

## Paso 1 — chore(deps)
- `npx expo install react-hook-form zod @hookform/resolvers`.
- react-hook-form: maneja el formulario. zod: las reglas. resolvers: conecta los dos.

## Paso 2 — feat(schemas)
- `src/schemas/recepcionSchema.ts`.
- `z.object({...})` define los campos y sus reglas, con mensajes en espanol.
- `z.coerce.number()`: el TextInput da texto (`"3200"`) y esto lo convierte a numero (`3200`) antes de validar. `<number>` le dice a TypeScript que el campo es numero para que `useForm` lo acepte.
- `RecepcionFormData = z.infer<typeof recepcionSchema>`: el tipo sale del schema, no se escribe a mano.

## Paso 3 — feat(components): FormField
- Un campo de texto reutilizable: `Controller` + `TextInput` + mensaje de error.
- Genericos: `FormField<T>` con `control: Control<T>` y `name: Path<T>`. TypeScript solo deja usar nombres de campos que existen. Sin `any`.
- `value == null ? '' : String(value)`: el TextInput solo acepta texto, asi que si el valor es numero se pasa a texto.
- El mensaje de error siempre ocupa espacio (`minHeight`) para que el formulario no salte.

## Paso 4 — feat(components): SelectField
- Mismo patron, pero con botones para elegir una opcion (material y estado).
- `onChange(opcion.value)` guarda el valor elegido en el formulario.

## Paso 5 — feat(data)
- `OPCIONES_MATERIAL` y `OPCIONES_ESTADO`: `value` es lo que se guarda y `label` es lo que se ve.

## Paso 6 — feat(screens): CreateScreen
- Antes (semana 5): un `useState` por campo y validacion a mano. Ahora lo hace React Hook Form con Zod.
- `useForm<RecepcionFormData>({ resolver: zodResolver(recepcionSchema), defaultValues })`.
- Devuelve `control` (conecta los campos), `handleSubmit`, `errors` e `isSubmitting`.
- Errores bajo cada campo: `errorMessage={errors.placa?.message}`.
- `handleSubmit(onSubmit)()`: primero valida con Zod. Si hay errores, los muestra y NO llama a `onSubmit`. Si todo esta bien, llama a `onSubmit(data)` con los datos ya validados y convertidos.
- Se llama dentro de una funcion (`() => handleSubmit(onSubmit)()`) porque el evento de `onPress` en React Native es distinto al de la web y TypeScript no los deja conectar directo.
- `mutateAsync` + `await`: `isSubmitting` dura mientras espera la API. Durante ese tiempo el boton se apaga y muestra un spinner.
- Si sale bien: `navigation.goBack()`. La lista ya se actualizo sola (invalidacion de la semana 5).

## Paso 7 — feat(hooks): useActualizarRecepcion
- `useMutation` con `PUT /recepciones/:id`.
- `onSuccess` invalida `['recepciones']`. Eso actualiza la lista Y cada camion individual (`['recepciones', id]`), porque todas las llaves empiezan igual.

## Paso 8 — feat(navigation): ruta
- `HomeEdit: { id, name }` en `HomeStackParamList`.

## Paso 9 — feat(screens): EditScreen
- Usa los mismos `FormField`, `SelectField` y schema que Crear.
- `useRecepcion(id)` pide el camion a la API.
- `useEffect(() => { if (recepcion) reset({...}) }, [recepcion, reset])`: cuando llegan los datos, `reset()` rellena el formulario. Tambien los toma como los valores "originales".
- `isDirty`: es `true` solo si el usuario cambio algo. El boton "Guardar cambios" esta apagado hasta entonces.
- Maneja cargando y error (con boton Reintentar), igual que el detalle.
- Los hooks (`useForm`, `useEffect`...) van ANTES de los `return` anticipados.

## Paso 10 — feat(navigation): registrar la pantalla
- Se agrega `HomeEdit` al Stack con titulo `Editar ${route.params.name}`.

## Paso 11 — feat(screens): boton Editar
- En el detalle: `navigation.navigate('HomeEdit', { id, name })`.
- `useNavigation<NativeStackNavigationProp<HomeStackParamList, 'HomeDetail'>>()` da el tipo correcto.

## Preguntas que pueden hacer (de la rubrica)

**1. Que ventaja tiene `Controller` frente a `register` en React Native?**
- `register` esta pensado para inputs HTML: usa la `ref` del elemento y sus eventos del navegador.
- El `TextInput` de React Native no es un input HTML y no expone la `ref` de esa forma.
- `Controller` no depende de eso: usa una prop `render` que recibe `value`, `onChange` y `onBlur`, y ahi se conectan `value`, `onChangeText` y `onBlur` del `TextInput`.

**2. Escribe un schema Zod con `name` (minimo 2 caracteres) y `price` (numero positivo)**
```ts
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Minimo 2 caracteres'),
  price: z.coerce.number().positive('Debe ser mayor que 0'),
});
```
- `z.coerce.number()` convierte el texto del input a numero.

**3. Por que usar `z.infer<typeof schema>` en vez de escribir una interfaz?**
- Evita duplicar: el tipo de TypeScript se genera solo desde el schema.
- Asi la validacion (en ejecucion) y los tipos (al compilar) siempre estan sincronizados. Si cambio una regla, el tipo cambia solo.

## Otras preguntas posibles
- **Que hace `zodResolver`?** Le dice a React Hook Form que use el schema de Zod para validar, y que ponga los mensajes de Zod en `errors`.
- **Para que sirve `handleSubmit`?** Valida antes de enviar. Si falla, llena `errors` y no llama a `onSubmit`.
- **Por que el peso usa `z.coerce`?** El TextInput siempre da texto. `coerce` lo convierte a numero antes de validar. Si escribo "abc" da NaN y sale el error "El peso debe ser un numero".
- **Para que sirve `reset()`?** Cambia todos los valores del formulario de una vez. En Editar se usa cuando llegan los datos de la API.
- **Que es `isDirty`?** Dice si el usuario cambio algo respecto a los valores originales.
- **Por que `FormField` es reutilizable?** Recibe `control`, `name` y `label` por props. Se usa igual en Crear y en Editar, sin copiar codigo.
- **Por que el schema es compartido?** Una sola fuente de reglas para Crear y Editar. Si cambia una regla, cambia en los dos.

## Como correr
```bash
pnpm install
pnpm start
pnpm typecheck
```
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DatosInicioContext } from '../src/context/DatosInicioContext';
import { REACT_APP_API_BIENVENIDO_PANEL } from '@env';
import styles, { HITSLOP } from './FiltrosBar.styles';

// === constantes ===
const STORAGE_KEY = 'filtrosSeleccionados';
const API_URL = REACT_APP_API_BIENVENIDO_PANEL;

// === tipos ===
type Opcion = { label: string; value: any; dias?: Date[] };

// === item lista opciones ===
const OpcionItem = ({
  item,
  selected,
  onPress,
}: {
  item: Opcion;
  selected: boolean;
  onPress: (op: Opcion) => void;
}) => (
  <Pressable
    onPress={() => onPress(item)}
    style={[styles.opcionItem, selected && styles.opcionItemSelected]}
    android_ripple={{ color: '#e6e9f2' }}
  >
    <Text style={[styles.opcionText, selected && styles.opcionTextSelected]}>
      {item.label}
    </Text>
    {selected ? <Icon name="check" size={18} color="#B4C400" /> : null}
  </Pressable>
);

// === componente principal ===
export default function FiltrosBar() {
  const { actualizarDatos } = useContext(DatosInicioContext) ?? {};
  const insets = useSafeAreaInsets();

  // opciones dinámicas
  const [optionsAnios, setOptionsAnios] = useState<Opcion[]>([]);
  const [optionsMes, setOptionsMes] = useState<Opcion[]>([]);
  const [optionsSemanas, setOptionsSemanas] = useState<Opcion[]>([]);
  const [optionsComercio, setOptionsComercio] = useState<Opcion[]>([]);

  // fechas de rango
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  // selección
  const [anio, setAnio] = useState<Opcion | null>(null);
  const [mes, setMes] = useState<Opcion | null>(null);
  const [semana, setSemana] = useState<Opcion | null>(null);
  const [comercio, setComercio] = useState<Opcion | null>(null);

  const [visible, setVisible] = useState(false);

  // === fetch de API al montar ===
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!resp.ok) throw new Error('Error al cargar filtros');
        const data = await resp.json();

        // Guardar fechas
        const fi = new Date(data.fechaInicio);
        const ff = new Date(data.fechaFin);
        setFechaInicio(fi);
        setFechaFin(ff);

        // Comercios (incluye "Todos")
        const optionsComercios: Opcion[] = [
          { value: 'todos', label: 'Todos' },
          ...data.comercios.map((c: string) => ({
            value: c.toLowerCase().replace(/\s+/g, ''),
            label: c,
          })),
        ];
        setOptionsComercio(optionsComercios);

        // Años
        const anios: Opcion[] = [];
        for (let y = fi.getFullYear(); y <= ff.getFullYear(); y++) {
          anios.push({ value: y, label: String(y) });
        }
        setOptionsAnios(anios);

        // Restaurar guardado
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          const _anio =
            anios.find((a) => a.value === saved?.anio?.value) ?? anios.at(-1)!;
          setAnio(_anio);
          actualizarMesesPorAnio(
            _anio.value,
            fi,
            ff,
            saved?.mes?.value,
            saved?.semana?.value
          );
          const _com =
            optionsComercios.find((c) => c.value === saved?.comercio?.value) ??
            optionsComercios[0];
          setComercio(_com);
        } else {
          // defaults: último año/mes/semana
          const ultimoAnio = anios.at(-1)!;
          setAnio(ultimoAnio);
          actualizarMesesPorAnio(ultimoAnio.value, fi, ff);
          setComercio(optionsComercios[0]);
        }
      } catch (err) {
        console.error('Error cargando filtros', err);
      }
    })();
  }, []);

  // === funciones auxiliares ===
  const actualizarMesesPorAnio = (
    anioSel: number,
    fi: Date,
    ff: Date,
    mesGuardado?: number,
    semanaGuardada?: number
  ) => {
    const mesInicio = anioSel === fi.getFullYear() ? fi.getMonth() : 0;
    const mesFin = anioSel === ff.getFullYear() ? ff.getMonth() : 11;

    const optionsMeses: Opcion[] = [];
    for (let m = mesInicio; m <= mesFin; m++) {
      const fecha = new Date(anioSel, m, 1);
      const nombreMes = fecha.toLocaleString('es', { month: 'long' });
      optionsMeses.push({ value: m + 1, label: nombreMes });
    }
    setOptionsMes(optionsMeses);

    let mesSel = optionsMeses.at(-1)!;
    if (mesGuardado) {
      mesSel = optionsMeses.find((o) => o.value === mesGuardado) ?? mesSel;
    }
    setMes(mesSel);
    actualizarSemanasPorMes(anioSel, mesSel.value, fi, ff, semanaGuardada);
  };

  const actualizarSemanasPorMes = (
    anioSel: number,
    mesSel: number,
    fi: Date,
    ff: Date,
    semanaGuardada?: number
  ) => {
    const primerDia = new Date(anioSel, mesSel - 1, 1);
    const ultimoDia = new Date(anioSel, mesSel, 0);

    let dia = new Date(primerDia);
    if (primerDia.getDay() !== 0) {
      dia.setDate(dia.getDate() - ((dia.getDay() + 6) % 7));
    }

    let semanas: Opcion[] = [];
    let semanaTemp: Date[] = [];
    let nroSemana = 0;

    while (dia <= ultimoDia || semanaTemp.length > 0) {
      if (dia.getDay() === 1) {
        if (semanaTemp.length > 0) {
          semanas.push({
            value: nroSemana,
            label: `Semana ${nroSemana}`,
            dias: [...semanaTemp],
          });
          semanaTemp = [];
        }
        nroSemana++;
      }
      if (dia.getMonth() === mesSel - 1) {
        semanaTemp.push(new Date(dia));
      }
      dia.setDate(dia.getDate() + 1);

      if (dia > ultimoDia && semanaTemp.length > 0) {
        semanas.push({
          value: nroSemana,
          label: `Semana ${nroSemana}`,
          dias: [...semanaTemp],
        });
        semanaTemp = [];
      }
    }

    const semanasFormateadas: Opcion[] = [
      { value: 98, label: 'Todo el Mes' },
      ...semanas,
    ];
    setOptionsSemanas(semanasFormateadas);

    let semanaSel = semanasFormateadas.at(-1)!;
    if (semanaGuardada) {
      semanaSel =
        semanasFormateadas.find((s) => s.value === semanaGuardada) ?? semanaSel;
    }
    setSemana(semanaSel);
  };

  // resumen
  const resumen = useMemo(() => {
    const parts = [anio?.label, mes?.label, semana?.label, comercio?.label];
    return parts.filter(Boolean).join(' · ') || 'Filtros';
  }, [anio, mes, semana, comercio]);

  // limpiar
  const limpiar = async () => {
    if (optionsAnios.length && fechaInicio && fechaFin) {
      const _anio = optionsAnios.at(-1)!;
      setAnio(_anio);
      actualizarMesesPorAnio(_anio.value, fechaInicio, fechaFin);
    }
    if (optionsComercio.length) setComercio(optionsComercio[0]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  // aplicar
  const aplicar = async () => {
    if (!anio || !mes || !semana || !comercio) return;
    const payload = { anio, mes, semana, comercio };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    actualizarDatos?.({
      anio: anio.value,
      mes: mes.value,
      semana: semana.value,
      comercio: comercio.value,
    });
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        <View style={styles.left}>
          <Icon name="filter" size={18} color="#B4C400" />
          <Text style={styles.text} numberOfLines={1}>
            {resumen || 'Filtros'}
          </Text>
        </View>
        <Icon name="chevron-right" size={22} color="#30313A" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop} />

        <View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}
        >
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={() => setVisible(false)} hitSlop={HITSLOP}>
              <Text style={styles.linkMuted}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Filtros</Text>
            <TouchableOpacity
              onPress={limpiar}
              hitSlop={HITSLOP}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={styles.linkMuted}>Limpiar</Text>
              <Icon
                name="send"
                size={16}
                color="#B4C400"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <CampoSelector
            titulo="Año"
            opciones={optionsAnios}
            seleccionado={anio}
            onSelect={(a) => {
              setAnio(a);
              if (fechaInicio && fechaFin)
                actualizarMesesPorAnio(a.value, fechaInicio, fechaFin);
            }}
          />

          <CampoSelector
            titulo="Mes"
            opciones={optionsMes}
            seleccionado={mes}
            onSelect={(m) => {
              setMes(m);
              if (fechaInicio && fechaFin && anio)
                actualizarSemanasPorMes(anio.value, m.value, fechaInicio, fechaFin);
            }}
          />

          <CampoSelector
            titulo="Semanas"
            opciones={optionsSemanas}
            seleccionado={semana}
            onSelect={setSemana}
          />

          <CampoSelector
            titulo="Comercio"
            opciones={optionsComercio}
            seleccionado={comercio}
            onSelect={setComercio}
          />

          <TouchableOpacity
            style={[styles.applyBtn, { marginTop: 12 }]}
            activeOpacity={0.9}
            onPress={aplicar}
          >
            <Text style={styles.applyText}>Aplicar</Text>
            <Icon name="thumbs-up" size={16} color="#B4C400" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

// === CampoSelector ===
function CampoSelector({
  titulo,
  opciones,
  seleccionado,
  onSelect,
}: {
  titulo: string;
  opciones: Opcion[];
  seleccionado: Opcion | null;
  onSelect: (op: Opcion) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => setOpen((v) => !v)}
      >
        <Text style={styles.rowLabel}>{titulo}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.rowValue} numberOfLines={1}>
            {seleccionado?.label ?? ''}
          </Text>
          <Icon
            name={open ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#9aa0b4"
          />
        </View>
      </TouchableOpacity>

      {open ? (
        <FlatList
          data={opciones}
          keyExtractor={(it, idx) => `${titulo}-${it.value}-${idx}`}
          renderItem={({ item }) => (
            <OpcionItem
              item={item}
              selected={seleccionado?.value === item.value}
              onPress={(op) => {
                onSelect(op);
                setOpen(false);
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          style={styles.optionsList}
        />
      ) : null}
    </>
  );
}

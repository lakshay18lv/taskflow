import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../components/EmptyState';
import LoadingButton from '../components/LoadingButton';
import TaskRow from '../components/TaskRow';
import { palettes } from '../constants/colors';
import { createTask, deleteTask, fetchTasks, toggleTask } from '../store/slices/tasksSlice';

export default function ProjectDetailScreen({ route, navigation }) {
  const { project } = route.params;
  const dispatch = useDispatch();
  const { byProject, loading, saving, error } = useSelector((state) => state.tasks);
  const mode = useSelector((state) => state.theme.mode);
  const colors = palettes[mode];
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const tasks = byProject[project.id] || [];

  useEffect(() => {
    dispatch(fetchTasks(project.id));
  }, [dispatch, project.id]);

  const submitTask = async () => {
    if (!title.trim()) return;
    const result = await dispatch(
      createTask({
        projectId: project.id,
        title: title.trim(),
        dueDate: dueDate.trim() || null,
      })
    );
    if (!result.error) {
      setTitle('');
      setDueDate('');
    }
  };

  const inputStyle = {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    marginBottom: 10,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
          <Text style={{ color: colors.primary, fontWeight: '900' }}>Back</Text>
        </Pressable>
        <Text style={{ color: colors.text, fontSize: 32, fontWeight: '900' }}>{project.title}</Text>
        <Text style={{ color: colors.muted, marginTop: 8, marginBottom: 18, lineHeight: 21 }}>
          {project.description || 'No project description.'}
        </Text>

        <View style={{ backgroundColor: colors.card, borderRadius: 24, padding: 16, borderColor: colors.border, borderWidth: 1, marginBottom: 18 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 12 }}>Add task</Text>
          <TextInput placeholder="Task title" placeholderTextColor={colors.muted} value={title} onChangeText={setTitle} style={inputStyle} />
          <TextInput
            placeholder="Due date optional: YYYY-MM-DD"
            placeholderTextColor={colors.muted}
            value={dueDate}
            onChangeText={setDueDate}
            style={inputStyle}
          />
          <LoadingButton title="Add Task" loading={saving} onPress={submitTask} colors={colors} />
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState colors={colors} title="No tasks yet" subtitle="Add a task and give this project a little heartbeat." />}
            renderItem={({ item }) => (
              <TaskRow
                task={item}
                colors={colors}
                onToggle={() => dispatch(toggleTask(item))}
                onDelete={() => dispatch(deleteTask(item))}
              />
            )}
          />
        )}

        {!!error && <Text style={{ color: colors.danger, marginTop: 8 }}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
}
